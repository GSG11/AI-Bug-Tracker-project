import BugList from "../components/BugList";

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Bug Dashboard</h1>
        <BugList />
      </div>
    </div>
  );
};

export default Dashboard;
