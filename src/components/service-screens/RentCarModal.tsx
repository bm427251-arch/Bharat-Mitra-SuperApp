import React, { useState } from 'react';
import { X, Calendar, Clock, Car, CheckCircle2, ShieldCheck, UserCheck, UserCheck2 } from 'lucide-react';

interface RentCarModalProps {
  onClose: () => void;
  langHindi?: boolean;
}

export const RentCarModal: React.FC<RentCarModalProps> = ({ onClose, langHindi = false }) => {
  const [driveMode, setDriveMode] = useState<'with_driver' | 'self_drive'>('with_driver');
  const [startDate, setStartDate] = useState('Tomorrow, 9:00 AM');
  const [endDate, setEndDate] = useState('After 3 Days, 8:00 PM');
  const [selectedVehicleIdx, setSelectedVehicleIdx] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const vehicles = [
    {
      name: 'Mahindra Bolero Neo (Mandi Tough)',
      category: 'Rural SUV • 7 Seater',
      dailyRate: 1500,
      owner: 'Ramlal Yadav (Rampur Village)',
      badge: 'High Ground Clearance • Village Approved',
      fuel: 'Diesel',
    },
    {
      name: 'Maruti Suzuki Swift VXi',
      category: 'Hatchback • 5 Seater',
      dailyRate: 1200,
      owner: 'Vikram Meena (City Center)',
      badge: '22 km/l Mileage • Economical',
      fuel: 'Petrol / CNG',
    },
    {
      name: 'Mahindra Scorpio-N Z4',
      category: 'Highway & Outstation SUV • 7 Seater',
      dailyRate: 2400,
      owner: 'Baljit Singh Dhillon (Panchayat Verified)',
      badge: 'All-Terrain 4x4 • Air Suspension',
      fuel: 'Diesel',
    },
    {
      name: 'Maruti Suzuki Ertiga Smart Hybrid',
      category: 'Family MUV • 7 Seater',
      dailyRate: 1800,
      owner: 'Kailash Choudhary (Civil Lines)',
      badge: 'Spacious Luggage Boot • AC Front & Rear',
      fuel: 'Petrol / Hybrid',
    },
  ];

  const currentCar = vehicles[selectedVehicleIdx];
  const driverChargePerDay = driveMode === 'with_driver' ? 400 : 0;
  const effectiveDailyRate = currentCar.dailyRate + driverChargePerDay;
  const totalDays = 3;
  const totalFare = effectiveDailyRate * totalDays;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#2E7D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚙</span>
            <div>
              <h2 className="text-base font-bold">
                {langHindi ? 'गाड़ी किराए पर लें' : 'Rent a Car • Bharat Mitra'}
              </h2>
              <p className="text-xs text-emerald-100">
                {langHindi 
                  ? 'ड्राइवर सह अथवा सेल्फ ड्राइव • स्थानीय मालिकों से' 
                  : 'Rural & long-term car rentals from local owners'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!bookingConfirmed ? (
            <>
              {/* CRITICAL TOGGLE: With Driver (ড্রাইভার সহ) vs Self-Drive (সেলফ ড্রাইভ) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {langHindi ? 'ड्राइविंग मोड चुनें:' : 'Select Rental Mode:'}
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setDriveMode('with_driver')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                      driveMode === 'with_driver'
                        ? 'bg-[#2E7D32] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <UserCheck2 className="w-4 h-4" />
                      <span>With Driver</span>
                    </span>
                    <span className={`text-[10px] font-medium ${driveMode === 'with_driver' ? 'text-emerald-100' : 'text-slate-500'}`}>
                      (ড্রাইভার সহ) • +₹400/day
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDriveMode('self_drive')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                      driveMode === 'self_drive'
                        ? 'bg-[#2E7D32] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Car className="w-4 h-4" />
                      <span>Self-Drive</span>
                    </span>
                    <span className={`text-[10px] font-medium ${driveMode === 'self_drive' ? 'text-emerald-100' : 'text-slate-500'}`}>
                      (সেলফ ড্রাইভ) • You Drive
                    </span>
                  </button>
                </div>
              </div>

              {/* Mode Description Tag */}
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                driveMode === 'with_driver'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-blue-50 text-blue-900 border border-blue-200'
              }`}>
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  {driveMode === 'with_driver'
                    ? 'Includes verified commercial chauffeur. Sit back & relax on village & highway routes.'
                    : 'Valid Driving License & Aadhaar KYC required. Zero security deposit on verified accounts.'}
                </span>
              </div>

              {/* Date & Time Selectors */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{langHindi ? 'किराया अवधि (तारीख व समय)' : 'Rental Schedule & Duration'}</span>
                  <span className="text-emerald-700 font-semibold">{totalDays} Days Booking</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">
                      {langHindi ? 'शुरुआत (Pick-up)' : 'Start Date & Time'}
                    </label>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">
                      {langHindi ? 'वापसी (Drop-off)' : 'Return Date & Time'}
                    </label>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Owner Vehicle Catalog */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  {langHindi ? 'उपलब्ध गाड़ियां (स्थानीय मालिकों से):' : 'Available Local Owner Vehicles:'}
                </label>

                {vehicles.map((v, idx) => {
                  const isSel = selectedVehicleIdx === idx;
                  const itemDaily = v.dailyRate + driverChargePerDay;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedVehicleIdx(idx)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSel
                          ? 'border-[#2E7D32] bg-emerald-50/70 ring-2 ring-[#2E7D32]'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{v.name}</h4>
                          <p className="text-xs text-slate-500">{v.category} · {v.fuel}</p>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-800 font-medium">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Owner: {v.owner}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-emerald-900">₹{itemDaily}</span>
                          <p className="text-[10px] text-slate-400">
                            /day {driveMode === 'with_driver' ? '(w/ driver)' : '(car only)'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">{v.badge}</span>
                        <span className="text-emerald-700 font-bold">Fast Approval</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total & Action */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    Total for {totalDays} Days ({driveMode === 'with_driver' ? 'With Driver / ড্রাইভার সহ' : 'Self-Drive / সেলফ ড্রাইভ'})
                  </p>
                  <p className="text-2xl font-black text-emerald-400">₹{totalFare.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right text-xs text-slate-300">
                  <p>Unlimited Kilometers</p>
                  <p className="text-[10px] text-slate-400">
                    {driveMode === 'with_driver' ? 'Driver allowance included' : 'Tolls & Fuel by Renter'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setBookingConfirmed(true)}
                className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256628] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Car className="w-5 h-5" />
                <span>
                  {langHindi
                    ? `${currentCar.name} बुक करें (${driveMode === 'with_driver' ? 'ड्राइवर सहित' : 'सेल्फ ड्राइव'})`
                    : `Reserve ${currentCar.name} • ${driveMode === 'with_driver' ? 'With Driver (ড্রাইভার সহ)' : 'Self-Drive (সেলফ ড্রাইভ)'} (₹${totalFare.toLocaleString('en-IN')})`}
                </span>
              </button>
            </>
          ) : (
            <div className="py-6 space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {langHindi ? 'गाड़ी आरक्षण अनुरोध स्वीकृत!' : 'Vehicle Reservation Confirmed!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {driveMode === 'with_driver'
                      ? `Owner ${currentCar.owner} will assign vehicle with dedicated driver at pickup location.`
                      : `Owner ${currentCar.owner} will inspect and hand over keys for Self-Drive.`}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Reserved Vehicle</span>
                  <span className="font-bold text-slate-900">{currentCar.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Rental Type</span>
                  <span className="font-bold text-emerald-700">
                    {driveMode === 'with_driver' ? 'With Driver (ড্রাইভার সহ)' : 'Self-Drive (সেলফ ড্রাইভ)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Handover Date</span>
                  <span className="font-bold text-slate-900">{startDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Return Date</span>
                  <span className="font-bold text-slate-900">{endDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Payable</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{totalFare.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#0B1B3D] text-white font-bold rounded-xl"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
