const MapVehicleSummary = (v) =>
  v
    ? {
        id: v.veh_idx,
        vehicleType: v.vehicle_type,
        model: v.model,
        vehicleNumber: v.vehicle_number,
      }
    : null;

const MapReservation = (b) => ({
  id: b.resv_idx,
  resvIdx: b.resv_idx,
  mainOption: b.main_option,
  midOption: b.mid_option,
  subOption: b.sub_option,
  vehicleId: b.veh_idx,
  vehIdx: b.veh_idx,
  vehicleLocation: b.vehicle_location,
  contractYn: b.contract_yn,
  date: b.date,
  time: b.time,
  createdAt: b.create_date,
  createdDate: b.create_date,
  vehicle: MapVehicleSummary(b.vehicle),
});

const MapReservationStatus = (booking) => ({
  id: booking.resv_idx,
  resvIdx: booking.resv_idx,
  contractYn: booking.contract_yn,
});

const MapApprovedReservation = (booking) => ({
  ...MapReservationStatus(booking),
  date: booking.date,
  time: booking.time,
});

module.exports = {
  MapReservation,
  MapReservationStatus,
  MapApprovedReservation,
};
