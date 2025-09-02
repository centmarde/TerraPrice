"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { useToast } from "../ui/toast"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import type { MaterialCost, LaborRate, RegionalAdjustment } from "../../types/analytics"

// Mock data
const mockMaterials: MaterialCost[] = [
  { id: "1", category: "Foundation", item: "Concrete", unitCost: 120, unit: "cubic yard", lastUpdated: "2024-03-01" },
  { id: "2", category: "Framing", item: "Lumber", unitCost: 2.5, unit: "board foot", lastUpdated: "2024-03-01" },
  { id: "3", category: "Roofing", item: "Asphalt Shingles", unitCost: 4.5, unit: "sq ft", lastUpdated: "2024-02-28" },
  {
    id: "4",
    category: "Electrical",
    item: "Copper Wire",
    unitCost: 3.2,
    unit: "linear foot",
    lastUpdated: "2024-03-01",
  },
]

const mockLaborRates: LaborRate[] = [
  { id: "1", trade: "General Contractor", hourlyRate: 85, region: "National", lastUpdated: "2024-03-01" },
  { id: "2", trade: "Electrician", hourlyRate: 75, region: "National", lastUpdated: "2024-03-01" },
  { id: "3", trade: "Plumber", hourlyRate: 70, region: "National", lastUpdated: "2024-02-28" },
  { id: "4", trade: "Carpenter", hourlyRate: 65, region: "National", lastUpdated: "2024-03-01" },
]

const mockRegionalAdjustments: RegionalAdjustment[] = [
  { id: "1", region: "West Coast", adjustment: 1.15, description: "High cost of living adjustment" },
  { id: "2", region: "East Coast", adjustment: 1.12, description: "Urban market premium" },
  { id: "3", region: "Midwest", adjustment: 0.95, description: "Lower cost region" },
  { id: "4", region: "South", adjustment: 0.88, description: "Competitive market rates" },
]

export const CostEstimationSettings: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialCost[]>(mockMaterials)
  const [laborRates, setLaborRates] = useState<LaborRate[]>(mockLaborRates)
  const [regionalAdjustments, setRegionalAdjustments] = useState<RegionalAdjustment[]>(mockRegionalAdjustments)
  const [overheadPercentage, setOverheadPercentage] = useState(15)
  const [profitMargin, setProfitMargin] = useState(10)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("materials")

  const { showToast } = useToast()

  const handleSaveItem = (item: any, type: "material" | "labor" | "regional") => {
    const updatedItem = { ...item, lastUpdated: new Date().toISOString().split("T")[0] }

    switch (type) {
      case "material":
        if (editingItem) {
          setMaterials((prev) => prev.map((m) => (m.id === item.id ? updatedItem : m)))
        } else {
          setMaterials((prev) => [...prev, { ...updatedItem, id: Date.now().toString() }])
        }
        break
      case "labor":
        if (editingItem) {
          setLaborRates((prev) => prev.map((l) => (l.id === item.id ? updatedItem : l)))
        } else {
          setLaborRates((prev) => [...prev, { ...updatedItem, id: Date.now().toString() }])
        }
        break
      case "regional":
        if (editingItem) {
          setRegionalAdjustments((prev) => prev.map((r) => (r.id === item.id ? updatedItem : r)))
        } else {
          setRegionalAdjustments((prev) => [...prev, { ...updatedItem, id: Date.now().toString() }])
        }
        break
    }

    setEditingItem(null)
    setIsDialogOpen(false)
    showToast(`${type} ${editingItem ? "updated" : "added"} successfully`, "success")
  }

  const handleDeleteItem = (id: string, type: "material" | "labor" | "regional") => {
    switch (type) {
      case "material":
        setMaterials((prev) => prev.filter((m) => m.id !== id))
        break
      case "labor":
        setLaborRates((prev) => prev.filter((l) => l.id !== id))
        break
      case "regional":
        setRegionalAdjustments((prev) => prev.filter((r) => r.id !== id))
        break
    }
    showToast(`${type} deleted successfully`, "success")
  }

  const MaterialDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Material" : "Add Material"}</DialogTitle>
          <DialogDescription>Configure material costs and specifications</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              defaultValue={editingItem?.category || ""}
              className="col-span-3"
              placeholder="e.g., Foundation"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item" className="text-right">
              Item
            </Label>
            <Input
              id="item"
              defaultValue={editingItem?.item || ""}
              className="col-span-3"
              placeholder="e.g., Concrete"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unitCost" className="text-right">
              Unit Cost
            </Label>
            <Input
              id="unitCost"
              type="number"
              defaultValue={editingItem?.unitCost || ""}
              className="col-span-3"
              placeholder="0.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unit
            </Label>
            <Input
              id="unit"
              defaultValue={editingItem?.unit || ""}
              className="col-span-3"
              placeholder="e.g., cubic yard"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const form = document.querySelector("form") as HTMLFormElement
              const formData = new FormData(form || document.createElement("form"))
              // Handle form submission logic here
              handleSaveItem(editingItem || {}, "material")
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Parameters</CardTitle>
            <CardDescription>System-wide cost calculation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="overhead">Overhead Percentage</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="overhead"
                  type="number"
                  value={overheadPercentage}
                  onChange={(e) => setOverheadPercentage(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-700">%</span>
              </div>
            </div>
            <div>
              <Label htmlFor="profit">Profit Margin</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="profit"
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-700">%</span>
              </div>
            </div>
            <Button onClick={() => showToast("Global parameters updated", "success")}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Updated</CardTitle>
            <CardDescription>Recent cost parameter updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Material Costs</span>
                <Badge variant="outline">Today</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Labor Rates</span>
                <Badge variant="outline">Yesterday</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Regional Adjustments</span>
                <Badge variant="outline">2 days ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Parameters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="labor">Labor Rates</TabsTrigger>
          <TabsTrigger value="regional">Regional Adjustments</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Material Costs</CardTitle>
                  <CardDescription>Configure material pricing and specifications</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(null)
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.category}</TableCell>
                      <TableCell>{material.item}</TableCell>
                      <TableCell>${material.unitCost}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>{material.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingItem(material)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(material.id, "material")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labor">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Labor Rates</CardTitle>
                  <CardDescription>Configure hourly rates by trade and region</CardDescription>
                </div>
                <Button onClick={() => showToast("Add Labor Rate feature coming soon", "info")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Labor Rate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trade</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laborRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.trade}</TableCell>
                      <TableCell>${rate.hourlyRate}/hr</TableCell>
                      <TableCell>{rate.region}</TableCell>
                      <TableCell>{rate.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => showToast("Edit Labor Rate feature coming soon", "info")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(rate.id, "labor")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Regional Adjustments</CardTitle>
                  <CardDescription>Configure regional cost multipliers</CardDescription>
                </div>
                <Button onClick={() => showToast("Add Region feature coming soon", "info")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Region
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionalAdjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-medium">{adjustment.region}</TableCell>
                      <TableCell>
                        <Badge variant={adjustment.adjustment > 1 ? "destructive" : "secondary"}>
                          {adjustment.adjustment}x
                        </Badge>
                      </TableCell>
                      <TableCell>{adjustment.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => showToast("Edit Region feature coming soon", "info")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(adjustment.id, "regional")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MaterialDialog />
    </div>
  )
}
