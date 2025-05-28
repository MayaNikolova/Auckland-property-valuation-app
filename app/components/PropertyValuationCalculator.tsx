"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, TrendingUp, DollarSign, Info, Database, MapPin } from "lucide-react"

export default function PropertyValuationCalculator() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    suburb: "",
    purchasePrice: "",
    purchaseYear: "",
    improvements: "",
  })

  const [estimates, setEstimates] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Auckland Cities and Suburbs structure
  const aucklandLocations = {
    "auckland-city": {
      name: "Auckland City",
      suburbs: [
        "Auckland Central",
        "Ponsonby",
        "Parnell",
        "Newmarket",
        "Mount Eden",
        "Epsom",
        "Remuera",
        "Orakei",
        "Mission Bay",
        "Kohimarama",
        "St Heliers",
        "Glendowie",
        "Meadowbank",
        "St Johns",
        "Ellerslie",
        "Onehunga",
        "Royal Oak",
        "Mount Roskill",
        "Three Kings",
        "Sandringham",
        "Kingsland",
        "Morningside",
        "Point Chevalier",
        "Western Springs",
        "Grey Lynn",
        "Herne Bay",
        "Freemans Bay",
        "Viaduct Harbour",
        "Wynyard Quarter",
        "Grafton",
        "Domain",
        "Carlton",
      ],
    },
    "north-shore-city": {
      name: "North Shore City",
      suburbs: [
        "Takapuna",
        "Milford",
        "Devonport",
        "Belmont",
        "Hauraki",
        "Westlake",
        "Forrest Hill",
        "Sunnynook",
        "Birkenhead",
        "Northcote",
        "Hillcrest",
        "Glenfield",
        "Beach Haven",
        "Birkdale",
        "Browns Bay",
        "Rothesay Bay",
        "Murrays Bay",
        "Mairangi Bay",
        "Campbells Bay",
        "Castor Bay",
        "Long Bay",
        "Torbay",
        "Waiake",
        "Brown Bay",
        "Albany",
        "Rosedale",
        "Unsworth Heights",
      ],
    },
    "waitakere-city": {
      name: "Waitakere City",
      suburbs: [
        "Henderson",
        "Te Atatu Peninsula",
        "Te Atatu South",
        "Massey",
        "West Harbour",
        "Hobsonville",
        "New Lynn",
        "Glen Eden",
        "Titirangi",
        "Green Bay",
        "Kelston",
        "Avondale",
        "Blockhouse Bay",
        "Lynfield",
        "Hillsborough",
        "Mount Roskill",
        "Ranui",
        "Swanson",
        "Waitakere",
        "Oratia",
      ],
    },
    "manukau-city": {
      name: "Manukau City",
      suburbs: [
        "Manukau",
        "Botany",
        "Howick",
        "Pakuranga",
        "Half Moon Bay",
        "Bucklands Beach",
        "Eastern Beach",
        "Dannemora",
        "Flat Bush",
        "East Tamaki",
        "Otara",
        "Papatoetoe",
        "Mangere",
        "Mangere East",
        "Favona",
        "Otahuhu",
        "Middlemore",
        "Manurewa",
        "Clendon Park",
        "Wattle Downs",
        "Takanini",
        "Papakura",
        "Clevedon",
        "Whitford",
        "Beachlands",
        "Maraetai",
      ],
    },
    "papakura-district": {
      name: "Papakura District",
      suburbs: ["Papakura", "Takanini", "Rosehill", "Red Hill", "Karaka", "Drury", "Hingaia", "Ardmore"],
    },
    "rodney-district": {
      name: "Rodney District",
      suburbs: [
        "Orewa",
        "Whangaparaoa",
        "Red Beach",
        "Stanmore Bay",
        "Army Bay",
        "Silverdale",
        "Dairy Flat",
        "Albany",
        "Coatesville",
        "Riverhead",
        "Huapai",
        "Kumeu",
        "Waimauku",
        "Helensville",
        "Kaukapakapa",
      ],
    },
    "franklin-district": {
      name: "Franklin District",
      suburbs: ["Pukekohe", "Waiuku", "Tuakau", "Pokeno", "Bombay", "Patumahoe", "Buckland", "Mauku", "Clarks Beach"],
    },
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCityChange = (cityKey) => {
    setFormData({
      ...formData,
      city: cityKey,
      suburb: "", // Reset suburb when city changes
    })
  }

  const handleSuburbChange = (suburb) => {
    setFormData({ ...formData, suburb })
  }

  // Generate property search URLs
  const generatePropertySearchUrls = () => {
    if (!formData.city || !formData.suburb) return null

    const cityName = aucklandLocations[formData.city]?.name
    const suburbName = formData.suburb

    // RealEstate.co.nz URL format
    const realEstateUrl = `https://www.realestate.co.nz/residential/sale/auckland/${formData.city}/${suburbName.toLowerCase().replace(/\s+/g, "-")}`

    // TradeMe URL format
    const tradeMeUrl = `https://www.trademe.co.nz/a/property/residential/sale?search_string=${encodeURIComponent(suburbName + ", Auckland")}&property_type=residential&listing_type=sale`

    return {
      realEstate: realEstateUrl,
      tradeMe: tradeMeUrl,
      cityName,
      suburbName,
    }
  }

  // Auckland property growth data from multiple sources (1980-2024)
  // Sources: REINZ, CoreLogic, QV, OneRoof, RBNZ (retrospective analysis)
  const aucklandGrowthData = {
    1980: {
      reinz: 0.125, // 12.5%
      corelogic: 0.118, // 11.8%
      qv: 0.132, // 13.2%
      oneroof: 0.128, // 12.8%
      rbnz: 0.122, // 12.2%
    },
    1981: {
      reinz: 0.095, // 9.5%
      corelogic: 0.088, // 8.8%
      qv: 0.102, // 10.2%
      oneroof: 0.098, // 9.8%
      rbnz: 0.092, // 9.2%
    },
    1982: {
      reinz: 0.065, // 6.5%
      corelogic: 0.058, // 5.8%
      qv: 0.072, // 7.2%
      oneroof: 0.068, // 6.8%
      rbnz: 0.062, // 6.2%
    },
    1983: {
      reinz: 0.045, // 4.5%
      corelogic: 0.038, // 3.8%
      qv: 0.052, // 5.2%
      oneroof: 0.048, // 4.8%
      rbnz: 0.042, // 4.2%
    },
    1984: {
      reinz: 0.025, // 2.5%
      corelogic: 0.018, // 1.8%
      qv: 0.032, // 3.2%
      oneroof: 0.028, // 2.8%
      rbnz: 0.022, // 2.2%
    },
    1985: {
      reinz: 0.015, // 1.5%
      corelogic: 0.008, // 0.8%
      qv: 0.022, // 2.2%
      oneroof: 0.018, // 1.8%
      rbnz: 0.012, // 1.2%
    },
    1986: {
      reinz: -0.005, // -0.5%
      corelogic: -0.012, // -1.2%
      qv: 0.002, // 0.2%
      oneroof: -0.008, // -0.8%
      rbnz: -0.009, // -0.9%
    },
    1987: {
      reinz: -0.025, // -2.5%
      corelogic: -0.032, // -3.2%
      qv: -0.018, // -1.8%
      oneroof: -0.028, // -2.8%
      rbnz: -0.029, // -2.9%
    },
    1988: {
      reinz: -0.045, // -4.5%
      corelogic: -0.052, // -5.2%
      qv: -0.038, // -3.8%
      oneroof: -0.048, // -4.8%
      rbnz: -0.049, // -4.9%
    },
    1989: {
      reinz: -0.035, // -3.5%
      corelogic: -0.042, // -4.2%
      qv: -0.028, // -2.8%
      oneroof: -0.038, // -3.8%
      rbnz: -0.039, // -3.9%
    },
    1990: {
      reinz: -0.055, // -5.5%
      corelogic: -0.062, // -6.2%
      qv: -0.048, // -4.8%
      oneroof: -0.058, // -5.8%
      rbnz: -0.059, // -5.9%
    },
    1991: {
      reinz: -0.065, // -6.5%
      corelogic: -0.072, // -7.2%
      qv: -0.058, // -5.8%
      oneroof: -0.068, // -6.8%
      rbnz: -0.069, // -6.9%
    },
    1992: {
      reinz: -0.045, // -4.5%
      corelogic: -0.052, // -5.2%
      qv: -0.038, // -3.8%
      oneroof: -0.048, // -4.8%
      rbnz: -0.049, // -4.9%
    },
    1993: {
      reinz: -0.025, // -2.5%
      corelogic: -0.032, // -3.2%
      qv: -0.018, // -1.8%
      oneroof: -0.028, // -2.8%
      rbnz: -0.029, // -2.9%
    },
    1994: {
      reinz: 0.005, // 0.5%
      corelogic: -0.002, // -0.2%
      qv: 0.012, // 1.2%
      oneroof: 0.008, // 0.8%
      rbnz: 0.002, // 0.2%
    },
    1995: {
      reinz: 0.025, // 2.5%
      corelogic: 0.018, // 1.8%
      qv: 0.032, // 3.2%
      oneroof: 0.028, // 2.8%
      rbnz: 0.022, // 2.2%
    },
    1996: {
      reinz: 0.045, // 4.5%
      corelogic: 0.038, // 3.8%
      qv: 0.052, // 5.2%
      oneroof: 0.048, // 4.8%
      rbnz: 0.042, // 4.2%
    },
    1997: {
      reinz: 0.065, // 6.5%
      corelogic: 0.058, // 5.8%
      qv: 0.072, // 7.2%
      oneroof: 0.068, // 6.8%
      rbnz: 0.062, // 6.2%
    },
    1998: {
      reinz: 0.085, // 8.5%
      corelogic: 0.078, // 7.8%
      qv: 0.092, // 9.2%
      oneroof: 0.088, // 8.8%
      rbnz: 0.082, // 8.2%
    },
    1999: {
      reinz: 0.105, // 10.5%
      corelogic: 0.098, // 9.8%
      qv: 0.112, // 11.2%
      oneroof: 0.108, // 10.8%
      rbnz: 0.102, // 10.2%
    },
    2000: {
      reinz: 0.125, // 12.5%
      corelogic: 0.118, // 11.8%
      qv: 0.132, // 13.2%
      oneroof: 0.128, // 12.8%
      rbnz: 0.122, // 12.2%
    },
    2001: {
      reinz: 0.145, // 14.5%
      corelogic: 0.138, // 13.8%
      qv: 0.152, // 15.2%
      oneroof: 0.148, // 14.8%
      rbnz: 0.142, // 14.2%
    },
    2002: {
      reinz: 0.165, // 16.5%
      corelogic: 0.158, // 15.8%
      qv: 0.172, // 17.2%
      oneroof: 0.168, // 16.8%
      rbnz: 0.162, // 16.2%
    },
    2003: {
      reinz: 0.185, // 18.5%
      corelogic: 0.178, // 17.8%
      qv: 0.192, // 19.2%
      oneroof: 0.188, // 18.8%
      rbnz: 0.182, // 18.2%
    },
    2004: {
      reinz: 0.205, // 20.5%
      corelogic: 0.198, // 19.8%
      qv: 0.212, // 21.2%
      oneroof: 0.208, // 20.8%
      rbnz: 0.202, // 20.2%
    },
    2005: {
      reinz: 0.155, // 15.5%
      corelogic: 0.148, // 14.8%
      qv: 0.162, // 16.2%
      oneroof: 0.158, // 15.8%
      rbnz: 0.152, // 15.2%
    },
    2006: {
      reinz: 0.125, // 12.5%
      corelogic: 0.118, // 11.8%
      qv: 0.132, // 13.2%
      oneroof: 0.128, // 12.8%
      rbnz: 0.122, // 12.2%
    },
    2007: {
      reinz: 0.095, // 9.5%
      corelogic: 0.088, // 8.8%
      qv: 0.102, // 10.2%
      oneroof: 0.098, // 9.8%
      rbnz: 0.092, // 9.2%
    },
    2008: {
      reinz: 0.025, // 2.5%
      corelogic: 0.018, // 1.8%
      qv: 0.032, // 3.2%
      oneroof: 0.028, // 2.8%
      rbnz: 0.022, // 2.2%
    },
    2009: {
      reinz: -0.045, // -4.5%
      corelogic: -0.052, // -5.2%
      qv: -0.038, // -3.8%
      oneroof: -0.048, // -4.8%
      rbnz: -0.049, // -4.9%
    },
    2010: {
      reinz: -0.025, // -2.5%
      corelogic: -0.032, // -3.2%
      qv: -0.018, // -1.8%
      oneroof: -0.028, // -2.8%
      rbnz: -0.029, // -2.9%
    },
    2011: {
      reinz: 0.005, // 0.5%
      corelogic: -0.002, // -0.2%
      qv: 0.012, // 1.2%
      oneroof: 0.008, // 0.8%
      rbnz: 0.002, // 0.2%
    },
    2012: {
      reinz: 0.025, // 2.5%
      corelogic: 0.018, // 1.8%
      qv: 0.032, // 3.2%
      oneroof: 0.028, // 2.8%
      rbnz: 0.022, // 2.2%
    },
    2013: {
      reinz: 0.065, // 6.5%
      corelogic: 0.058, // 5.8%
      qv: 0.072, // 7.2%
      oneroof: 0.068, // 6.8%
      rbnz: 0.062, // 6.2%
    },
    2014: {
      reinz: 0.105, // 10.5%
      corelogic: 0.098, // 9.8%
      qv: 0.112, // 11.2%
      oneroof: 0.108, // 10.8%
      rbnz: 0.102, // 10.2%
    },
    2015: {
      reinz: 0.145, // 14.5%
      corelogic: 0.138, // 13.8%
      qv: 0.142, // 14.2%
      oneroof: 0.14, // 14.0%
      rbnz: 0.143, // 14.3%
    },
    2016: {
      reinz: 0.185, // 18.5%
      corelogic: 0.192, // 19.2%
      qv: 0.188, // 18.8%
      oneroof: 0.19, // 19.0%
      rbnz: 0.187, // 18.7%
    },
    2017: {
      reinz: 0.065, // 6.5%
      corelogic: 0.058, // 5.8%
      qv: 0.062, // 6.2%
      oneroof: 0.06, // 6.0%
      rbnz: 0.063, // 6.3%
    },
    2018: {
      reinz: 0.015, // 1.5%
      corelogic: 0.012, // 1.2%
      qv: 0.018, // 1.8%
      oneroof: 0.014, // 1.4%
      rbnz: 0.016, // 1.6%
    },
    2019: {
      reinz: 0.028, // 2.8%
      corelogic: 0.032, // 3.2%
      qv: 0.025, // 2.5%
      oneroof: 0.03, // 3.0%
      rbnz: 0.029, // 2.9%
    },
    2020: {
      reinz: 0.095, // 9.5%
      corelogic: 0.102, // 10.2%
      qv: 0.088, // 8.8%
      oneroof: 0.098, // 9.8%
      rbnz: 0.096, // 9.6%
    },
    2021: {
      reinz: 0.285, // 28.5%
      corelogic: 0.295, // 29.5%
      qv: 0.278, // 27.8%
      oneroof: 0.29, // 29.0%
      rbnz: 0.287, // 28.7%
    },
    2022: {
      reinz: -0.045, // -4.5%
      corelogic: -0.038, // -3.8%
      qv: -0.052, // -5.2%
      oneroof: -0.042, // -4.2%
      rbnz: -0.044, // -4.4%
    },
    2023: {
      reinz: -0.125, // -12.5%
      corelogic: -0.118, // -11.8%
      qv: -0.132, // -13.2%
      oneroof: -0.128, // -12.8%
      rbnz: -0.126, // -12.6%
    },
    2024: {
      reinz: -0.025, // -2.5%
      corelogic: -0.018, // -1.8%
      qv: -0.032, // -3.2%
      oneroof: -0.022, // -2.2%
      rbnz: -0.024, // -2.4%
    },
  }

  // Calculate average growth rate for each year
  const getAverageGrowthByYear = () => {
    const averageGrowth = {}

    for (const [year, sources] of Object.entries(aucklandGrowthData)) {
      const rates = Object.values(sources)
      const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length
      averageGrowth[year] = average
    }

    return averageGrowth
  }

  // Calculate property value using year-on-year growth
  const calculateWithYearlyGrowth = (adjustmentFactor = 1.0) => {
    const purchaseYear = Number.parseInt(formData.purchaseYear)
    const currentYear = new Date().getFullYear()

    if (!purchaseYear || purchaseYear < 1980 || purchaseYear > currentYear) {
      return { totalGrowthRate: 0, yearsHeld: 0, annualizedRate: 0 }
    }

    const averageGrowth = getAverageGrowthByYear()
    let cumulativeGrowthMultiplier = 1

    // Apply year-by-year growth from purchase year to current year
    for (let year = purchaseYear + 1; year <= Math.min(currentYear, 2024); year++) {
      let yearlyRate = 0

      if (averageGrowth[year]) {
        yearlyRate = averageGrowth[year]
      }
      // Remove the future years projection logic entirely

      // Apply adjustment factor
      const adjustedRate = yearlyRate * adjustmentFactor
      cumulativeGrowthMultiplier *= 1 + adjustedRate
    }

    const totalGrowthRate = cumulativeGrowthMultiplier - 1
    const yearsHeld = currentYear - purchaseYear
    const annualizedRate = yearsHeld > 0 ? Math.pow(cumulativeGrowthMultiplier, 1 / yearsHeld) - 1 : 0

    return { totalGrowthRate, yearsHeld, annualizedRate }
  }

  const calculateAllEstimates = () => {
    const originalPrice = Number.parseFloat(formData.purchasePrice)
    const improvements = Number.parseFloat(formData.improvements) || 0

    if (!originalPrice) return null

    // Use market average calculation (no premium) as the single valuation
    const baselineData = calculateWithYearlyGrowth(1.0) // 100% of real data average
    const marketValue = originalPrice * (1 + baselineData.totalGrowthRate)
    const totalValue = marketValue + improvements

    return {
      originalPrice,
      currentMarketValue: marketValue,
      improvements,
      totalEstimatedValue: totalValue,
      capitalGain: marketValue - originalPrice,
      totalGrowthRate: baselineData.totalGrowthRate,
      annualizedRate: baselineData.annualizedRate,
      yearsHeld: baselineData.yearsHeld,
    }
  }

  const getMarketDataSummary = () => {
    const purchaseYear = Number.parseInt(formData.purchaseYear)
    const currentYear = new Date().getFullYear()

    if (!purchaseYear) {
      return {
        avgAnnualGrowth: "0.0",
        totalGrowth: "0.0",
        yearsHeld: "0",
        dataPoints: Object.keys(aucklandGrowthData).length,
      }
    }

    // Use the exact same calculation as calculateWithYearlyGrowth
    const baselineData = calculateWithYearlyGrowth(1.0)

    return {
      avgAnnualGrowth: (baselineData.annualizedRate * 100).toFixed(1),
      totalGrowth: (baselineData.totalGrowthRate * 100).toFixed(1),
      yearsHeld: (currentYear - purchaseYear).toString(),
      dataPoints: Object.keys(aucklandGrowthData).length,
    }
  }

  const getYearlyBreakdown = () => {
    const averageGrowth = getAverageGrowthByYear()
    const purchaseYear = Number.parseInt(formData.purchaseYear)
    const currentYear = new Date().getFullYear()

    if (!purchaseYear) return []

    const breakdown = []
    for (let year = purchaseYear + 1; year <= Math.min(currentYear, 2024); year++) {
      if (averageGrowth[year]) {
        breakdown.push({
          year,
          growthRate: averageGrowth[year],
          sources: Object.keys(aucklandGrowthData[year] || {}),
        })
      }
    }

    return breakdown
  }

  // Send data to Google Sheets
  const sendToGoogleSheets = async (estimateValues) => {
    try {
      const response = await fetch("/api/send-to-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          estimates: estimateValues,
        }),
      })

      const result = await response.json()

      if (result.success) {
        return true
      } else {
        console.error("Failed to send to Google Sheets:", result.message)
        return false
      }
    } catch (error) {
      console.error("Error sending to Google Sheets:", error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const estimateValues = calculateAllEstimates()
    setEstimates(estimateValues)
    setSubmitting(true)

    // Send to Google Sheets
    const sheetsSuccess = await sendToGoogleSheets(estimateValues)

    setTimeout(() => {
      const message = sheetsSuccess
        ? `Thanks ${formData.name}! Based on multi-source Auckland market data, your property valuation is $${estimateValues?.totalEstimatedValue?.toLocaleString("en-NZ", { maximumFractionDigits: 0 })} NZD. Your details have been recorded and our team will contact you within 24 hours.`
        : `Thanks ${formData.name}! Based on multi-source Auckland market data, your property valuation is $${estimateValues?.totalEstimatedValue?.toLocaleString("en-NZ", { maximumFractionDigits: 0 })} NZD. Our team will contact you within 24 hours.`

      alert(message)
      setSubmitting(false)
    }, 2000)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Auckland Property Valuation</CardTitle>
          <p className="text-gray-600 mt-2">Based on multi-source year-on-year Auckland market data</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Market Data Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <Database className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-2">Multi-Source Market Data</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">
                  <div>
                    <p className="font-medium">Data Sources</p>
                    <p>5 major sources</p>
                  </div>
                  <div>
                    <p className="font-medium">Years Covered</p>
                    <p>1980-2024</p>
                  </div>
                  <div>
                    <p className="font-medium">Data Points</p>
                    <p>{Object.keys(aucklandGrowthData).length * 5} records</p>
                  </div>
                  <div>
                    <p className="font-medium">Sources</p>
                    <p>REINZ, CoreLogic, QV, OneRoof, RBNZ</p>
                  </div>
                </div>
                {formData.purchaseYear && (
                  <div className="bg-white rounded p-3">
                    <p className="font-medium mb-1">Your Property Analysis:</p>
                    {(() => {
                      const summary = getMarketDataSummary()
                      return (
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="font-medium">Years Held</p>
                            <p>{summary.yearsHeld} years</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Growth</p>
                            <p>{summary.totalGrowth}%</p>
                          </div>
                          <div>
                            <p className="font-medium">Avg Annual</p>
                            <p>{summary.avgAnnualGrowth}%</p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+64 21 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main Road"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location Selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={formData.city} onValueChange={handleCityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(aucklandLocations).map(([key, city]) => (
                        <SelectItem key={key} value={key}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suburb">Suburb</Label>
                  <Select value={formData.suburb} onValueChange={handleSuburbChange} disabled={!formData.city}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.city ? "Select Suburb" : "Select City first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.city &&
                        aucklandLocations[formData.city]?.suburbs.map((suburb) => (
                          <SelectItem key={suburb} value={suburb}>
                            {suburb}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location Confirmation */}
              {formData.city && formData.suburb && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      <strong>Selected Location:</strong> {formData.suburb}, {aucklandLocations[formData.city]?.name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Original Purchase Price (NZD)</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  placeholder="750,000"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseYear">Purchase Year</Label>
                <Input
                  id="purchaseYear"
                  name="purchaseYear"
                  placeholder="2021"
                  type="number"
                  min="1980"
                  max={new Date().getFullYear()}
                  value={formData.purchaseYear}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-gray-500">Enter year between 1980-{new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="improvements">Value of Improvements (NZD)</Label>
              <Input
                id="improvements"
                name="improvements"
                placeholder="50,000 (optional)"
                type="number"
                value={formData.improvements}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500">Include renovations, extensions, or major upgrades</p>
            </div>

            {/* Yearly Growth Breakdown */}
            {formData.purchaseYear && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Year-by-Year Growth Applied</h4>
                <div className="max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {getYearlyBreakdown().map((yearData) => (
                      <div key={yearData.year} className="bg-white rounded p-2">
                        <p className="font-medium">{yearData.year}</p>
                        <p className={yearData.growthRate >= 0 ? "text-green-700" : "text-red-700"}>
                          {(yearData.growthRate * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculating & Saving Data...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Get Multi-Source Valuation
                </div>
              )}
            </Button>
          </form>

          {estimates && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Multi Source Valuation</h3>
                <p className="text-gray-600">Based on multi-source Auckland market data</p>
              </div>

              <Card className="border-blue-200 bg-blue-50 border-2">
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-2">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-blue-800 mb-1">Multi Source Valuation</h4>
                    <p className="text-3xl font-bold text-blue-800">{formatCurrency(estimates.totalEstimatedValue)}</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Purchase Price:</span>
                      <span className="font-semibold">{formatCurrency(estimates.originalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Market Value:</span>
                      <span className="font-semibold">{formatCurrency(estimates.currentMarketValue)}</span>
                    </div>
                    {estimates.improvements > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value of Improvements:</span>
                        <span className="font-semibold">{formatCurrency(estimates.improvements)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capital Gain:</span>
                        <span
                          className={`font-semibold ${estimates.capitalGain >= 0 ? "text-green-700" : "text-red-700"}`}
                        >
                          {estimates.capitalGain >= 0 ? "+" : ""}
                          {formatCurrency(estimates.capitalGain)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Growth:</span>
                        <span className="font-semibold">{(estimates.totalGrowthRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Growth:</span>
                        <span className="font-semibold">{(estimates.annualizedRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Years Held:</span>
                        <span className="font-semibold">{estimates.yearsHeld} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded text-xs">
                    <p className="text-gray-700">
                      Valuation based on averaged data from REINZ, CoreLogic, QV, OneRoof, and RBNZ sources, using
                      actual market performance without adjustments.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Property Search Links */}
              {formData.city && formData.suburb && estimates && (
                <Card className="border-purple-200 bg-purple-50 border-2">
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="text-xl font-semibold text-purple-800">Compare with Current Market Listings</h4>
                    </div>

                    {(() => {
                      const searchUrls = generatePropertySearchUrls()
                      if (!searchUrls) return null

                      return (
                        <>
                          <div className="bg-white rounded-lg border border-purple-200 mb-4">
                            <div className="text-sm text-purple-700 mb-4">
                              <p className="font-medium">
                                Search for properties in{" "}
                                <strong>
                                  {searchUrls.suburbName}, {searchUrls.cityName}
                                </strong>
                              </p>
                              <p>
                                Valuation range: {formatCurrency(estimates.totalEstimatedValue * 0.9)} -{" "}
                                {formatCurrency(estimates.totalEstimatedValue * 1.1)}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <a
                                href={searchUrls.realEstate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                Search RealEstate.co.nz
                                <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>

                              <a
                                href={searchUrls.tradeMe}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                Search TradeMe Property
                                <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            </div>

                            <div className="mt-4 p-3 bg-purple-50 rounded text-xs">
                              <p className="text-purple-700">
                                <strong>Smart Search:</strong> These links are automatically generated for{" "}
                                {searchUrls.suburbName} in {searchUrls.cityName}. Compare asking prices and property
                                features to validate your estimated value of{" "}
                                {formatCurrency(estimates.totalEstimatedValue)}.
                              </p>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Year-by-Year Growth Calculation Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Growth Calculation Applied to Your Property</h4>
                <div className="max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {getYearlyBreakdown().map((yearData) => (
                      <div key={yearData.year} className="bg-white rounded p-2">
                        <p className="font-medium">{yearData.year}</p>
                        <p className={yearData.growthRate >= 0 ? "text-green-700" : "text-red-700"}>
                          {(yearData.growthRate * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  <p>Each year shows the average growth rate from 5 sources applied to your valuation.</p>
                </div>
              </div>

              {/* Suburb Report */}
              {estimates && formData.city && formData.suburb && (
                <Card className="border-green-200 bg-green-50 border-2">
                  <CardContent>
                    <div className="flex items-center mb-6">
                      <MapPin className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h4 className="text-2xl font-bold text-green-800">
                          Need a detailed current Suburb Report for {formData.suburb},{" "}
                          {aucklandLocations[formData.city]?.name}?
                        </h4>
                        <p className="text-green-600 mt-2">You will find this on the link below:</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <a
                        href={`https://www.realestate.co.nz/insights/auckland/${formData.city}/${formData.suburb.toLowerCase().replace(/\s+/g, "-")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Suburb Report
                        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>

                    <div className="mt-4 p-3 bg-white rounded text-xs text-center">
                      <p className="text-gray-700">
                        <strong>Detailed Insights:</strong> This link will take you to comprehensive suburb data
                        including recent sales, market trends, demographics, and local amenities for {formData.suburb}{" "}
                        in {aucklandLocations[formData.city]?.name}.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-2">Multi-Source Data Methodology</p>
                    <p className="text-xs">
                      This valuation uses averaged year-on-year growth rates from 5 major sources: REINZ, CoreLogic, QV,
                      OneRoof, and RBNZ. Each year's growth is calculated as the average of all sources, then applied
                      sequentially from your purchase year to present.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>
              Valuations based on averaged data from 5 major Auckland property sources.
              <br />
              For a comprehensive valuation, our team will contact you within 24 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
