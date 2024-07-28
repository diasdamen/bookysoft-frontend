// Define interfaces
interface RoomAttributes {
  title: string;
}

interface RoomData {
  attributes: RoomAttributes;
}

interface ReservationAttributes {
  checkIn: string;
  checkOut: string;
  room: {
    data: RoomData;
  };
}

interface Reservation {
  id: string;
  attributes: ReservationAttributes;
}

interface UserReservations {
  data: Reservation[];
}

interface User {
  email: string;
}


// Import necessary modules
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CancelReservation from "@/components/CancelReservation";


const getUserReservations = async (userEmail: string): Promise<UserReservations> => {
  try {
    const res = await fetch(
      `https://bookysoft-backend.onrender.com/api/reservations?[filters][email][$eq]=${userEmail}&populate=*`,
      {
        next: {
          revalidate: 0
        },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch reservations: ${res.statusText}`);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser() as User;

  let userReservations: UserReservations = { data: [] };
  try {
    if (user?.email) {
      userReservations = await getUserReservations(user.email);
    }
  } catch (error) {
    console.error('Error loading reservations:', error);
  }

  // Check if userReservations.data is an array and has length
  const hasReservations = Array.isArray(userReservations.data) && userReservations.data.length > 0;

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8 h-full">
        <h3 className="h3 font-bold mb-12 border-b pb-4 text-center lg:text-left">
          My bookings
        </h3>
        <div className="flex flex-col gap-8 h-full">
          {!hasReservations ? (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <p className="text-xl text-center text-secondary/70 mb-4">
                You dont have any reservations.
              </p>
              {/* Back to homepage button */}
              <Link href="/">
                <Button size="md">Go to homepage</Button>
              </Link>
            </div>
          ) : (
            userReservations.data.map((reservation: Reservation) => (
              <div key={reservation.id} className="bg-tertiary py-8 px-12">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <h3 className="text-2xl font-medium w-[200px] text-center lg:text-left">
                    {reservation.attributes.room.data.attributes.title}
                  </h3>
                  {/* Check-in & Check-out text */}
                  <div className="flex flex-col lg:flex-row gap-2 lg:w-[380px]">
                    {/* Check-in */}
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-accent font-bold uppercase tracking-[2px]">
                        from:
                      </span>
                      <span className="text-secondary font-semibold">
                        {format(new Date(reservation.attributes.checkIn), "PPP")}
                      </span>
                    </div>
                    {/* Check-out */}
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-accent font-bold uppercase tracking-[2px]">
                        to:
                      </span>
                      <span className="text-secondary font-semibold">
                        {format(new Date(reservation.attributes.checkOut), "PPP")}
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