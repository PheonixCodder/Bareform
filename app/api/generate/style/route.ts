import {
  ConsumeCreditsQuery,
  CreditsBalanceQuery,
  MoodBoardImagesQuery,
} from "@/convex/query.config";
import { MoodBoardImage } from "@/hooks/use-styles";
import { prompts } from "@/prompts";
import { fetchMutation, preloadedQueryResult } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, Output } from "ai";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const ColorSwatchSchema = z.object({
  name: z.string(),
  hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color"),
  description: z.string().optional(),
});

const PrimaryColorsSchema = z.object({
  title: z.literal("Primary Colors"),
  swatches: z.array(ColorSwatchSchema).length(4),
});

const SecondaryColorsSchema = z.object({
  title: z.literal("Secondary & Accent Colors"),
  swatches: z.array(ColorSwatchSchema).length(4),
});

const UIComponentColorsSchema = z.object({
  title: z.literal("UI Component Colors"),
  swatches: z.array(ColorSwatchSchema).length(6),
});

const UtilityColorsSchema = z.object({
  title: z.literal("Utility & Form Colors"),
  swatches: z.array(ColorSwatchSchema).length(3),
});

const StatusColorsSchema = z.object({
  title: z.literal("Status & Feedback Colors"),
  swatches: z.array(ColorSwatchSchema).length(2),
});

const TypographySectionSchema = z.object({
  name: z.string(),
  fontFamily: z.string(),
  fontSize: z.string(),
  fontWeight: z.string(),
  lineHeight: z.string(),
  letterSpacing: z.string().optional(),
  description: z.string().optional(),
});

const StyleGuideSchema = z.object({
  theme: z.string(),
  description: z.string(),
  colorSections: z.tuple([
    PrimaryColorsSchema,
    SecondaryColorsSchema,
    UIComponentColorsSchema,
    UtilityColorsSchema,
    StatusColorsSchema,
  ]),
  typographySections: z.array(TypographySectionSchema).length(3),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;
    if (!projectId) {
      return NextResponse.json({
        error: "Project ID is required",
        status: 400,
      });
    }

    const { ok: balanceOk, balance: balanceBalance } =
      await CreditsBalanceQuery();

    if (!balanceOk) {
      return NextResponse.json({
        error: "Failed to get balance",
        status: 500,
      });
    }

    if (balanceBalance === 0) {
      return NextResponse.json(
        {
          error: "No credits available",
        },
        { status: 400 },
      );
    }
    const moodBoardImages = await MoodBoardImagesQuery(projectId);
    if (
      !moodBoardImages ||
      preloadedQueryResult(moodBoardImages.images).length === 0
    ) {
      return NextResponse.json({
        error:
          "No mood board images found. Please upload images to the mood board first.",
        status: 400,
      });
    }

    const images = preloadedQueryResult(
      moodBoardImages.images,
    ) as unknown as MoodBoardImage[];
    const imageUrls = images.map((img) => img.url).filter(Boolean);
    const systemPrompt = prompts.styleGuide.system;

    const userPrompt = `Analyze these ${imageUrls.length} mood board images and generate a design system:
Extract colors that work harmoniously together and create typography that matches the aesthetic.
Return ONLY the JSON object matching the exact schema structure above.`;

    const result = await generateText({
      model: openrouter("nvidia/nemotron-nano-12b-v2-vl:free"),
      output: Output.object({
        schema: StyleGuideSchema,
      }),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            ...imageUrls.map((url) => ({
              type: "image" as const,
              image: url as string, // Fix: ensure it's a valid URL
            })),
          ],
        },
      ],
    });

    const { ok, balance } = await ConsumeCreditsQuery({ amount: 1 });
    if (!ok) {
      return NextResponse.json({
        error: "Failed to generate style guide",
        status: 500,
      });
    }

    await fetchMutation(
      api.projects.updateProjectStyleGuide,
      {
        projectId: projectId as Id<"projects">,
        styleGuideData: result.output,
      },
      {
        token: await convexAuthNextjsToken(),
      },
    );

    return NextResponse.json({
      success: true,
      styleGuide: result.output,
      message: "Style guide generated successfully",
      balance,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate style guide",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
