import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { Calendar, Users, CheckCircle, Eye, X } from "lucide-react";

// Components
const Button = ({ children, variant = "primary", onClick, className = "", disabled = false }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border border-gray-300 hover:border-blue-500 text-blue-600",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children }) => <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 border">{children}</div>;

// API functions
const fetchTournaments = async () => {
  const res = await axios.get("http://localhost:5000/api/tournaments/upcoming");
  return res.data;
};

const fetchUserRegistrations = async () => {
  const res = await axios.get("http://localhost:5000/api/tournaments/my-registrations", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

const fetchTeamsForTournament = async (tournamentId) => {
  const res = await axios.get(`http://localhost:5000/api/tournaments/${tournamentId}/teams`);
  return res.data;
};

const registerTeam = async (data) => {
  const res = await axios.post("http://localhost:5000/api/tournaments/register-team", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

const TournamentPage = () => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [form, setForm] = useState({ team_name: "", members: "" });
  const [teamsMap, setTeamsMap] = useState({});
  const [showingTeamsFor, setShowingTeamsFor] = useState(null);

  const { data: tournaments = [], refetch } = useQuery("upcomingTournaments", fetchTournaments);
  const { data: registrations = [] } = useQuery("userRegistrations", fetchUserRegistrations);
  const registeredIds = registrations.map((r) => r.tournament_id);

  const mutation = useMutation(registerTeam, {
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Team registered!",
        text: "Your team has been successfully registered.",
        timer: 2000,
        showConfirmButton: false,
      });
      setForm({ team_name: "", members: "" });
      setSelectedTournament(null);
      refetch();
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err.response?.data?.message || "Something went wrong.",
      });
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();
    mutation.mutate({ ...form, tournament_id: selectedTournament.id });
  };

  const handleViewTeams = async (tournamentId) => {
    const teams = await fetchTeamsForTournament(tournamentId);
    setTeamsMap((prev) => ({ ...prev, [tournamentId]: teams }));
    setShowingTeamsFor(tournamentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">🏆 Upcoming Tournaments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {tournaments.map((t) => (
          <Card key={t.id}>
            <h2 className="text-xl font-bold text-green-800 mb-2">{t.name}</h2>
            <p className="text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t.start_date} – {t.end_date}
            </p>
            <p className="text-sm text-gray-500 mb-4">Status: {t.status}</p>

            {registeredIds.includes(t.id) ? (
              <p className="text-green-600 font-semibold flex items-center gap-1">
                <CheckCircle className="h-5 w-5" />
                Already Registered
              </p>
            ) : (
              <Button onClick={() => setSelectedTournament(t)} className="mt-2">
                Register Team
              </Button>
            )}

            <Button onClick={() => handleViewTeams(t.id)} className="mt-2" variant="outline">
              <Eye className="h-4 w-4" />
              View Teams
            </Button>

            {showingTeamsFor === t.id && (
              <div className="mt-4 bg-gray-50 p-3 rounded border text-sm">
                <h3 className="font-semibold mb-2">Registered Teams</h3>
                {teamsMap[t.id]?.length ? (
                  <ul className="list-disc pl-5">
                    {teamsMap[t.id].map((team) => (
                      <li key={team.id}>{team.team_name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No teams registered yet.</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {selectedTournament && (
        <form onSubmit={handleRegister} className="mt-10 max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-700">Register for {selectedTournament.name}</h2>
            <button onClick={() => setSelectedTournament(null)} type="button">
              <X className="h-5 w-5 text-red-500 hover:text-red-700" />
            </button>
          </div>

          <input
            type="text"
            name="team_name"
            placeholder="Team Name"
            value={form.team_name}
            onChange={(e) => setForm({ ...form, team_name: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            name="members"
            placeholder="Team Members (comma-separated)"
            value={form.members}
            onChange={(e) => setForm({ ...form, members: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setSelectedTournament(null)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TournamentPage;
