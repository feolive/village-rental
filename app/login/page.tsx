import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left text-white py-6">
          <h1 className="text-5xl font-bold">Village Rental</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
