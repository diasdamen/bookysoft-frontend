import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CancelReservation from "@/components/CancelReservation";

async function getUserReservations(userEmail: string) {
  try {
    const res = await fetch(
      `https://bookysoft-backend.onrender.com/api/reservations?[filters][email][$eq]=${userEmail}&populate=*`
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return { data: [] }; // Return empty data on error
  }
}

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let userReservations = { data: [] };

  if (user?.email) {
    userReservations = await getUserReservations(user.email);
  }

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8 h-full">
        <h3 className="h3 font-bold mb-12 border-b pb-4 text-center lg:text-left">
          My bookings
        </h3>
        <div className="flex flex-col gap-8 h-full">
          {userReservations.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <p className="text-xl text-center text-secondary/70 mb-4">
                You dont have any reservations.
              </p>
              <Link href="/">
                <Button size="md">Go to homepage</Button>
              </Link>
            </div>
          ) : (
            userReservations.data.map((reservation: any) => (
              <div key={reservation.id} className="bg-tertiary py-8 px-12">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <h3 className="text-2xl font-medium w-[200px] text-center lg:text-left">
                    {reservation.attributes.room.data?.attributes?.title || "No Title"}
                  </h3>
                  <div className="flex flex-col lg:flex-row gap-2 lg:w-[380px]">
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-accent font-bold uppercase tracking-[2px]">
                        from:
                      </span>
                      <span className="text-secondary font-semibold">
                        {reservation.attributes.checkIn ? format(reservation.attributes.checkIn, "PPP") : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-accent font-bold uppercase tracking-[2px]">
                        to:
                      </span>
                      <span className="text-secondary font-semibold">
                        {reservation.attributes.checkOut ? format(reservation.attributes.checkOut, "PPP") : "N/A"}
                      </span>
                    </div>
                  </div>
                  <CancelReservation reservation={reservation} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;