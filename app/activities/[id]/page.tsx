import { notFound } from "next/navigation"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"
import { ActivityDetailPage } from "@/components/activities/activity-detail-page"

export function generateStaticParams() {
  return OFFTHETRAIL_DATA.activities.map((activity) => ({
    id: activity.id,
  }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const activity = OFFTHETRAIL_DATA.activities.find((a) => a.id === params.id)
  
  if (!activity) {
    return {
      title: "Activity Not Found | Offthetrail",
    }
  }

  return {
    title: `${activity.title} | Offthetrail Activities`,
    description: activity.description,
  }
}

export default function Page({ params }: { params: { id: string } }) {
  const activity = OFFTHETRAIL_DATA.activities.find((a) => a.id === params.id)
  
  if (!activity) {
    notFound()
  }

  return <ActivityDetailPage activity={activity} />
}
