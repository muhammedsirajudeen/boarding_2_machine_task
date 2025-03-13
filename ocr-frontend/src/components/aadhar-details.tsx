import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { AadhaarData} from "@/types/aadhar"
interface AadhaarDetailsProps {
  data: AadhaarData
}

export default function AadhaarDetails({ data }: AadhaarDetailsProps) {
  const detailItems = [
    { label: "Name", value: data.name },
    { label: "Date of Birth", value: data.dob },
    { label: "Gender", value: data.gender },
    { label: "Aadhaar Number", value: data.aadhaarNumber },
    { label: "Address", value: data.address },
    { label: "Pin Code", value: data.pincode },
    { label: "Issue Date", value: data.issueDate },
  ]

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-2">
        {detailItems.map((item, index) => (
          <div key={index}>
            <div className="flex flex-col py-2">
              <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value || "Not detected"}</span>
            </div>
            {index < detailItems.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


