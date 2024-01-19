import Form from "@/components/Form";
import NavigationButton from "@/components/NavigationButton";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";

export default function CreateTripPage() {
  const { mutate } = useSWR("/api/trips");

  async function addTrip(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const tripData = Object.fromEntries(formData);

    const startDate = new Date(tripData.start);
    const endDate = new Date(tripData.end);

    if (endDate < startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    const response = await fetch(`/api/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });

    if (response.ok) {
      mutate();
      toast.success("Trip saved successfully");
      event.target.reset();
    }
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <h1>TripTrove</h1>

      <Form onSubmit={addTrip} formName={"add-trip"} />
      <NavigationButton href="/" letter="←" />
    </>
  );
}
