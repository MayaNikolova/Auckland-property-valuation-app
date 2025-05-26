import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("API Route - Received data:", data)

    // Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL

    if (!GOOGLE_SCRIPT_URL) {
      console.log("Google Script URL not configured, logging data:")
      console.log("SHEET DATA:", {
        name: data.formData.name,
        email: data.formData.email,
        phone: data.formData.phone,
        address: data.formData.address,
        suburb: data.formData.suburb,
        purchasePrice: data.formData.purchasePrice,
        purchaseYear: data.formData.purchaseYear,
        improvements: data.formData.improvements || 0,
        currentMarketValue: data.estimates.currentMarketValue,
        totalEstimatedValue: data.estimates.totalEstimatedValue,
        capitalGain: data.estimates.capitalGain,
        totalGrowthPercent: (data.estimates.totalGrowthRate * 100).toFixed(1),
        annualGrowthPercent: (data.estimates.annualizedRate * 100).toFixed(1),
        yearsHeld: data.estimates.yearsHeld,
      })

      return NextResponse.json({
        success: true,
        message: "Data logged to console (Google Sheets not configured)",
      })
    }

    console.log("API Route - Using Google Script URL:", GOOGLE_SCRIPT_URL)

    // Prepare data for Google Sheets
    const sheetData = {
      name: data.formData.name,
      email: data.formData.email,
      phone: data.formData.phone,
      address: data.formData.address,
      suburb: data.formData.suburb,
      purchasePrice: Number(data.formData.purchasePrice),
      purchaseYear: Number(data.formData.purchaseYear),
      improvements: Number(data.formData.improvements) || 0,
      currentMarketValue: Math.round(data.estimates.currentMarketValue),
      totalEstimatedValue: Math.round(data.estimates.totalEstimatedValue),
      capitalGain: Math.round(data.estimates.capitalGain),
      totalGrowthPercent: (data.estimates.totalGrowthRate * 100).toFixed(1),
      annualGrowthPercent: (data.estimates.annualizedRate * 100).toFixed(1),
      yearsHeld: data.estimates.yearsHeld,
    }

    console.log("API Route - Sending to Google Sheets:", sheetData)

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sheetData),
    })

    console.log("API Route - Google Sheets response status:", response.status)

    const responseText = await response.text()
    console.log("API Route - Google Sheets response text:", responseText)

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} - ${responseText}`)
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error("API Route - Failed to parse response as JSON:", parseError)
      throw new Error(`Invalid JSON response from Google Sheets: ${responseText}`)
    }

    console.log("API Route - Parsed result:", result)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Data successfully added to Google Sheets",
      })
    } else {
      throw new Error(result.error || "Unknown error from Google Sheets")
    }
  } catch (error) {
    console.error("API Route - Error sending to Google Sheets:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to update Google Sheets: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

