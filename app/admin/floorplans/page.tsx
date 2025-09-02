import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Check, X, Eye, Download } from "lucide-react"

// Mock data for floorplans
const floorplans = [
  {
    id: "FP-001",
    fileName: "office-complex-a.pdf",
    status: "pending",
    uploadedAt: "2024-01-15 10:30 AM",
    estimatedCost: "$2.4M",
  },
  {
    id: "FP-002",
    fileName: "residential-building-b.dwg",
    status: "approved",
    uploadedAt: "2024-01-15 09:15 AM",
    estimatedCost: "$1.8M",
  },
  {
    id: "FP-003",
    fileName: "warehouse-project.pdf",
    status: "pending",
    uploadedAt: "2024-01-15 08:45 AM",
    estimatedCost: "$3.2M",
  },
  {
    id: "FP-004",
    fileName: "retail-space-design.dwg",
    status: "rejected",
    uploadedAt: "2024-01-14 04:20 PM",
    estimatedCost: "$950K",
  },
  {
    id: "FP-005",
    fileName: "mixed-use-development.pdf",
    status: "approved",
    uploadedAt: "2024-01-14 02:10 PM",
    estimatedCost: "$5.7M",
  },
  {
    id: "FP-006",
    fileName: "school-building-layout.dwg",
    status: "pending",
    uploadedAt: "2024-01-14 11:30 AM",
    estimatedCost: "$4.1M",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function FloorplanReviewPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Floorplan Review</h1>
            <p className="text-muted-foreground mt-2">Review and approve uploaded floorplans</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold text-foreground">2</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">$18.2M</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floorplans Table */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Uploaded Floorplans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">File Name</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Uploaded</TableHead>
                    <TableHead className="font-semibold">Est. Cost</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {floorplans.map((floorplan) => (
                    <TableRow key={floorplan.id} className="border-border/50">
                      <TableCell className="font-medium text-foreground">{floorplan.id}</TableCell>
                      <TableCell className="text-foreground">{floorplan.fileName}</TableCell>
                      <TableCell>{getStatusBadge(floorplan.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{floorplan.uploadedAt}</TableCell>
                      <TableCell className="font-medium text-foreground">{floorplan.estimatedCost}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {floorplan.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
