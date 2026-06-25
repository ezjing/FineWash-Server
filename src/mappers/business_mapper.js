const MapBusinessDetail = (bd) => ({
  id: bd.bus_dtl_idx,
  busDtlIdx: bd.bus_dtl_idx,
  busMstIdx: bd.bus_mst_idx,
  roomName: bd.room_name,
  activeYn: bd.active_yn,
  startDate: bd.start_date,
  endDate: bd.end_date,
});

const MapRoom = (room) => ({
  busDtlIdx: room.bus_dtl_idx,
  busMstIdx: room.bus_mst_idx,
  roomName: room.room_name,
  activeYn: room.active_yn,
  startDate: room.start_date,
  endDate: room.end_date,
});

const MapBusinessReservation = (r) => ({
  resvIdx: r.resv_idx,
  busMstIdx: r.bus_mst_idx,
  memIdx: r.mem_idx,
  vehIdx: r.veh_idx,
  mainOption: r.main_option,
  midOption: r.mid_option,
  subOption: r.sub_option,
  vehicleLocation: r.vehicle_location,
  contractYn: r.contract_yn,
  date: r.date,
  time: r.time,
  paymentAmount: r.payment_amount,
  createdDate: r.create_date,
  updateDate: r.update_date,
});

const MapBusiness = (b, { includeUpdatedAt = true } = {}) => {
  const mapped = {
    id: b.bus_mst_idx,
    busMstIdx: b.bus_mst_idx,
    memIdx: b.mem_idx,
    businessNumber: b.business_number,
    companyName: b.company_name,
    phone: b.phone,
    email: b.email,
    address: b.address,
    addressDetail: b.address_detail,
    latitude: b.latitude,
    longitude: b.longitude,
    businessType: b.business_type,
    depositYn: b.deposit_yn,
    depositAmount: b.deposit_amount,
    remark: b.remark,
    businessDetails: Array.isArray(b.businessDetails)
      ? b.businessDetails.map(MapBusinessDetail)
      : [],
    createdAt: b.create_date,
  };
  if (includeUpdatedAt) mapped.updatedAt = b.update_date;
  return mapped;
};

module.exports = {
  MapRoom,
  MapBusinessDetail,
  MapBusinessReservation,
  MapBusiness,
};
