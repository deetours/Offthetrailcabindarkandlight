export const publicRoutes = [
  "/",
  "/about",
  "/stays",
  "/stays/dalhousie",
  "/trips",
  "/trips/spiti",
  "/activities",
  "/activities/jibhi-zipline",
  "/cafe",
  "/terms",
  "/login",
] as const

export const criticalRoutes = [
  "/",
  "/stays",
  "/stays/dalhousie",
  "/booking/stay/dalhousie?room=Standard%20Room",
  "/payment?type=stay&id=dalhousie&total=4500",
  "/cafe",
  "/trips/spiti",
] as const

export const protectedRoutes = ["/return", "/memories", "/admin"] as const
