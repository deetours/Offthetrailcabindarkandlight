import { notFound } from "next/navigation"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"
import { ActivityDetailPage } from "@/components/activities/activity-detail-page"

export function generateStaticParams() {
  return OFFTHETRAIL_DATA.activities.map((activity) => ({
    id: activity.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const activity = OFFTHETRAIL_DATA.activities.find((a) => a.id === resolvedParams.id)
  
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

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const activity = OFFTHETRAIL_DATA.activities.find((a) => a.id === resolvedParams.id)
  
  if (!activity) {
    notFound()
  }

  return <ActivityDetailPage activity={activity} />
}
