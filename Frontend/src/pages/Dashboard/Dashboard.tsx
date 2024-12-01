import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiRequestAuth } from '../../lib/apiRequest';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';

const Dashboard: React.FC = () => {
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  const navigate = useNavigate();
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const [mostRequestTypeChart, setMostRequestTypeChart] = useState<any>(null);
  const [durationRangeEmergenciesChart, setDurationRangeEmergenciesChart] = useState<any>(null);
  const [totalUsersCountChart, setTotalUsersCountChart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toast = useRef(null);

  useEffect(() => {
    if (currentToken?.user.isFirefighter) navigate('/app/firefighter-shift');
    if (currentToken?.user.isUser) navigate('/app/emergency-request');

    const fetchData = async () => {
      try {        
        const mostRequestTypeData = await apiRequestAuth.get('/views/most-requested-emergencies', { headers: { Authorization: `Bearer ${currentToken?.token}` } });
        const durationRangeEmergenciesData = await apiRequestAuth.get('/views/duration-range-emergencies', { headers: { Authorization: `Bearer ${currentToken?.token}` } });
        const totalUsersCountData = await apiRequestAuth.get('/views/total-users-by-role', { headers: { Authorization: `Bearer ${currentToken?.token}` } });
        
        setMostRequestTypeChart({
          labels: mostRequestTypeData.data.map((item: any) => item.emergency_type),
          datasets: [
            {
              label: 'Solicitudes de emergencias atendidas',
              data: mostRequestTypeData.data.map((item: any) => item.total_requests),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderColor: '#000',
              borderWidth: 1,
            },
          ],
        });

        const durationData = durationRangeEmergenciesData.data;
        const labels = [...new Set(durationData.map((item: any) => item.emergency_type))];
        const ranges = [...new Set(durationData.map((item: any) => item.duration_range))];
        setDurationRangeEmergenciesChart({
          labels,
          datasets: ranges.map((range: string) => ({
            label: range,
            data: labels.map((label: string) => {
              const item = durationData.find((entry: any) => entry.emergency_type === label && entry.duration_range === range);
              return item ? item.quantity : 0;
            }),
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          })),
        });

        const totalUsersData = totalUsersCountData.data[0];
        setTotalUsersCountChart({
          labels: ['Administradores', 'Bomberos', 'Usuarios'],
          datasets: [
            {
              data: [
                parseInt(totalUsersData.total_admins),
                parseInt(totalUsersData.total_firefighters),
                parseInt(totalUsersData.total_users),
              ],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        showAlert('error', 'Error', 'Error al cargar los datos');
      }
    };

    fetchData();
  }, []);

  const showAlert = (severity: string, summary: string, detail: string) => toast.current?.show({ severity, summary, detail });

  if (loading) return <p className="text-center text-lg text-gray-600">Cargando datos...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Administrativo</h1>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-4 shadow-md rounded-lg lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Duración de las Emergencias</h2>
          {durationRangeEmergenciesChart && (
            <Chart
              type="bar"
              data={durationRangeEmergenciesChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'top' } },
                scales: { x: { stacked: true }, y: { stacked: true } },
              }}
            />
          )}
        </div>
          
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Emergencias Más Solicitadas</h2>
          {mostRequestTypeChart && (
            <Chart
              type="bar"
              data={mostRequestTypeChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'top' } },
              }}
            />
          )}
        </div>
          
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Usuarios Totales por Rol</h2>
          {totalUsersCountChart && (
            <Chart
              type="doughnut"
              data={totalUsersCountChart}
              options={{
                plugins: { legend: { display: true, position: 'top' } },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );  
};

export default Dashboard;
