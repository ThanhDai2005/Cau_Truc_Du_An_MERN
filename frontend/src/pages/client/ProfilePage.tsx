import LogOut from "@/components/auth/LogOut";
import { useAuthStore } from "@/stores/useAuthStore";

const ProfilePage = () => {
  const user = useAuthStore((store) => store.user);

  return (
    <>
      <div>ProfilePage</div>
      <LogOut />
    </>
  );
};

export default ProfilePage;
