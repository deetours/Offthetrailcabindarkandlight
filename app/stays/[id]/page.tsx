import { StayDetails } from "@/components/stays/stay-details"
import { notFound, redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === 'jibhi' || id === 'jibhi-canopy') {
    return {
      title: "Jibhi Canopy Cottages | Coming Soon | Offthetrail",
      description: "A spacious multi-level stay in the canopy. Coming soon.",
    }
  }

  if (id === 'dalhousie' || id === 'dalhousie-estate') {
    return {
      title: "Off The Trail Dalhousie Estate | Boutique Hotel in Dalhousie, Himachal Pradesh",
      description: "A 10-room boutique mountain retreat on Bakrota Ridge, Dalhousie.",
    }
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data: stay } = await supabase
      .from('stays')
      .select('name, description, tagline')
      .eq('id', id)
      .single()

    if (!stay) return { title: "Stay Not Found | Offthetrail" }
    return {
      title: `${stay.name} | Offthetrail`,
      description: stay.description || stay.tagline || "A Offthetrail stay.",
    }
  } catch {
    return { title: "Stay | Offthetrail" }
  }
}

export default async function StayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === 'jibhi' || id === 'jibhi-canopy') {
    redirect('/jibhi')
  }

  if (id === 'dalhousie' || id === 'dalhousie-estate') {
    redirect('/stays/dalhousie')
  }

  const supabase = await createSupabaseServerClient()
  const { data: stay, error } = await supabase
    .from('stays')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !stay) {
    notFound()
  }

  // Map Supabase stay fields to the shape StayDetails expects
  const stayForComponent = {
    id: stay.id,
    name: stay.name || "Untitled Stay",
    location: stay.location || "",
    state: stay.location || "",
    tagline: stay.tagline || "",
    heroImage: stay.image_url || "/hero2.png",
    feeling: stay.description || stay.tagline || "",
    images: Array.isArray(stay.gallery) ? stay.gallery.filter(Boolean) : [],
    quotes: [] as { text: string; author: string }[],
    amenities: Array.isArray(stay.amenities) ? stay.amenities.filter(Boolean) : [],
    roomTypes: [
      {
        name: stay.room_type || "Room",
        price: stay.price || 0,
        description: `Capacity: ${stay.capacity || 1} guest${(stay.capacity || 1) !== 1 ? 's' : ''}`,
      },
    ],
  }

  return <StayDetails stay={stayForComponent} />
}
