export const navLinks = [
  {
    id: 1,
    name: "Home",
    url: "/",
  },
  {
    id: 2,
    name: "Create Event",
    url: "/events/create",
  },
  {
    id: 3,
    name: "My Profile",
    url: "/profile",
  },
] as const;

export const eventFormDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};
