"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, FileImage, X } from "lucide-react"
import { useProjects } from "../../contexts/ProjectContext"
import { useToast } from "../ui/toast"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export const FileUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const { uploadFloorplan } = useProjects()
  const { showToast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          setSelectedFile(file)
          if (!projectName) {
            setProjectName(file.name.split(".")[0])
          }
        } else {
          showToast("Please upload an image or PDF file", "error")
        }
      }
    },
    [projectName, showToast],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        setSelectedFile(file)
        if (!projectName) {
          setProjectName(file.name.split(".")[0])
        }
      }
    },
    [projectName],
  )

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !projectName.trim()) {
      showToast("Please select a file and enter a project name", "error")
      return
    }

    setIsUploading(true)
    try {
      await uploadFloorplan(selectedFile, projectName.trim(), description.trim() || undefined)
      showToast("Floorplan uploaded successfully!", "success")

      // Reset form
      setSelectedFile(null)
      setProjectName("")
      setDescription("")
    } catch (error) {
      showToast("Failed to upload floorplan", "error")
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, projectName, description, uploadFloorplan, showToast])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Floorplan</CardTitle>
        <CardDescription>Upload your architectural floorplan for cost estimation analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-secondary bg-secondary/10"
              : selectedFile
                ? "border-green-300 bg-green-50"
                : "border-border hover:border-secondary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileImage className="h-8 w-8 text-green-600" />
                <span className="font-medium text-green-700">{selectedFile.name}</span>
                <Button variant="ghost" size="sm" onClick={removeFile} className="text-red-500 hover:text-red-700">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">Drop your floorplan here</p>
                <p className="text-muted-foreground">or click to browse files</p>
              </div>
              <p className="text-sm text-muted-foreground">Supports: JPG, PNG, PDF (Max 10MB)</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium mb-2">
              Project Name *
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add project description or notes"
              rows={3}
            />
          </div>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !projectName.trim() || isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? "Uploading..." : "Start Analysis"}
        </Button>
      </CardContent>
    </Card>
  )
}
