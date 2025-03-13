"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  title: string
  description: string
  onImageUpload: (file: File) => void
  previewUrl: string | null
}

export default function ImageUploader({ title, description, onImageUpload, previewUrl }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        onImageUpload(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files[0])
    }
  }

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageUpload(new File([], ""))
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {!previewUrl ? (
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md h-64 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="text-xs text-muted-foreground">Drag and drop or click to upload</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2">
                <ImageIcon className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative h-64">
            <img src={previewUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-contain" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


