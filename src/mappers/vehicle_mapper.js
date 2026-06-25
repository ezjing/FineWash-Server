const ToIsoOrNull = (value) => (value ? value.toISOString() : null);

const MapVehicle = (v) => ({
  id: v.veh_idx,
  vehIdx: v.veh_idx,
  vehicleType: v.vehicle_type,
  model: v.model,
  vehicleNumber: v.vehicle_number,
  color: v.color,
  year: v.year,
  remark: v.remark,
  memIdx: v.mem_idx,
  createdDate: ToIsoOrNull(v.create_date),
  updateDate: ToIsoOrNull(v.update_date),
});

module.exports = {
  MapVehicle,
};
