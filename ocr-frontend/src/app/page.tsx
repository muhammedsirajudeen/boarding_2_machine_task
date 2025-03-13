"use client"

import { useState } from "react"
import { FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUploader from "@/components/image-uploader"
import AadhaarDetails from "@/components/aadhar-details"
import type { AadhaarData } from "@/types/aadhar"
export default function Home() {
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aadhaarData, setAadhaarData] = useState<AadhaarData | null>(null)
  const [activeTab, setActiveTab] = useState("upload")

  const handleFrontImageUpload = (file: File) => {
    setFrontImage(file)
    const reader = new FileReader()
    reader.onload = () => {
      setFrontPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleBackImageUpload = (file: File) => {
    setBackImage(file)
    const reader = new FileReader()
    reader.onload = () => {
      setBackPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const processImages = async () => {
    if (!frontImage || !backImage) {
      setError("Please upload both front and back images of the Aadhaar card")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("frontImage", frontImage)
      formData.append("backImage", backImage)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process images")
      }

      const data = await response.json()
      setAadhaarData(data)
      setActiveTab("result")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFrontImage(null)
    setBackImage(null)
    setFrontPreview(null)
    setBackPreview(null)
    setAadhaarData(null)
    setError(null)
    setActiveTab("upload")
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Aadhaar Card OCR System</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Upload the front and back images of your Aadhaar card to extract information using Optical Character
          Recognition.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="result" disabled={!aadhaarData}>
            OCR Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Aadhaar Card Images</CardTitle>
              <CardDescription>
                Please upload clear images of both the front and back sides of your Aadhaar card.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ImageUploader
                  title="Front Side"
                  description="Upload the front side of your Aadhaar card"
                  onImageUpload={handleFrontImageUpload}
                  previewUrl={frontPreview}
                />
                <ImageUploader
                  title="Back Side"
                  description="Upload the back side of your Aadhaar card"
                  onImageUpload={handleBackImageUpload}
                  previewUrl={backPreview}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm} disabled={isLoading}>
                Reset
              </Button>
              <Button onClick={processImages} disabled={isLoading || !frontImage || !backImage}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Extract Information
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="result">
          {aadhaarData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Aadhaar Information Extracted
                </CardTitle>
                <CardDescription>
                  The following information was extracted from your Aadhaar card images.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Uploaded Images</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {frontPreview && (
                        <div className="border rounded-md overflow-hidden">
                          <img
                            src={frontPreview || "/placeholder.svg"}
                            alt="Aadhaar Front"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      )}
                      {backPreview && (
                        <div className="border rounded-md overflow-hidden">
                          <img
                            src={backPreview || "/placeholder.svg"}
                            alt="Aadhaar Back"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Extracted Information</h3>
                    <AadhaarDetails data={aadhaarData} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Process Another Card
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}


