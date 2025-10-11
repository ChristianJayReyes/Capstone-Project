import React from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import '../../styles/dashboard.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = React.useState({ 
      stats: { total_bookings: 0, pending_bookings: 0, confirmed_bookings: 0, total_revenue: 0, available_rooms: 0, total_rooms: 0 },
      recentBookings: []
    });
    
    React.useEffect(() => {
      const load = async () => {
        try {
          const [statsRes, recentRes] = await Promise.all([
            fetch('/api/dashboard/stats'),
            fetch('/api/dashboard/recent-bookings?limit=10')
          ]);
          
          const [statsData, recentData] = await Promise.all([statsRes.json(), recentRes.json()]);
          
          setDashboardData({ 
            stats: statsData.success ? statsData.data : { total_bookings: 0, pending_bookings: 0, confirmed_bookings: 0, total_revenue: 0, available_rooms: 0, total_rooms: 0 },
            recentBookings: recentData.success ? recentData.data : []
          });
        } catch (e) {
          console.error('Failed to load dashboard', e);
          setDashboardData({ 
            stats: { total_bookings: 0, pending_bookings: 0, confirmed_bookings: 0, total_revenue: 0, available_rooms: 0, total_rooms: 0 },
            recentBookings: []
          });
        }
      };
      load();
    }, []);
    
  return (
    <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl px-4">

    <Title align='center' font='outfit' title='Dashboard' subTitle='/'/>

    {/* KPI Cards */}
    <div className='flex gap-4 my-8 justify-center'>
      {/* total bookings */}
      <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
        <img src={assets.totalBookingIcon} alt="total-booking" className='max-sm:hidden h-10' />
        <div className='flex flex-col sm:ml-4 font-medium'>
          <p className='text-blue-500 text-lg'>Total Bookings</p>
          <p className='text-neutral-400 text-base'>{dashboardData.stats.total_bookings}</p>
        </div>
      </div>

      {/* pending approvals */}
      <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
        <img src={assets.badgeIcon} alt="pending-approval" className='max-sm:hidden h-10' />
        <div className='flex flex-col sm:ml-4 font-medium'>
          <p className='text-blue-500 text-lg'>Pending Approval</p>
          <p className='text-neutral-400 text-base'>{dashboardData.stats.pending_bookings}</p>
        </div>
      </div>

      {/* confirmed bookings */}
      <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
        <img src={assets.badgeIcon} alt="confirmed-bookings" className='max-sm:hidden h-10' />
        <div className='flex flex-col sm:ml-4 font-medium'>
          <p className='text-blue-500 text-lg'>Confirmed</p>
          <p className='text-neutral-400 text-base'>{dashboardData.stats.confirmed_bookings}</p>
        </div>
      </div>

      {/* total revenue */}
      <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
        <img src={assets.totalRevenueIcon} alt="total-revenue" className='max-sm:hidden h-10' />
        <div className='flex flex-col sm:ml-4 font-medium'>
          <p className='text-blue-500 text-lg'>Total Revenue</p>
          <p className='text-neutral-400 text-base'>₱ {dashboardData.stats.total_revenue.toLocaleString()}</p>
        </div>
      </div>
    </div>

    {/* Recent Bookings */}
    <div className='flex justify-between items-center mb-5 mt-20'>
      <h2 className='text-xl text-blue-950/70 font-medium text-center flex-1'>Recent Bookings</h2>
      <a 
        href="/owner/bookings" 
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        View All Bookings
      </a>
    </div>

    <div className='w-full text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
      <table className='w-full'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='py-3 px-4 text-gray-800 font-medium'>Username</th>
            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
          </tr>
        </thead>
        <tbody className='text-sm'>
          {dashboardData.recentBookings.map((item, index) => (
            <tr key={index}>
              <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                {item.full_name || 'Guest'}
              </td>
              <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm-hidden'>
                {item.type_name}
              </td>
              <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                ₱ {item.total_price || 0}
              </td>
              <td className='py-3 px-4 border-t border-gray-300 flex justify-center'>
                <button className={`py-1 px-3 text-xs rounded-full mx-auto ${((item.status||'').toLowerCase()==='confirmed'||(item.status||'').toLowerCase()==='checked-in'||(item.status||'').toLowerCase()==='checked-out') ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-yellow-600'}`}>
                  {((item.status||'').toLowerCase()==='confirmed'||(item.status||'').toLowerCase()==='checked-in'||(item.status||'').toLowerCase()==='checked-out') ? 'Completed' : 'Pending'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  )
}

export default Dashboard