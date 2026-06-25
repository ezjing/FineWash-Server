const MapMstRow = (m) => ({
  woptMstIdx: m.wopt_mst_idx,
  busMstIdx: m.bus_mst_idx,
  optionName: m.option_name,
  vehicleType: m.vehicle_type,
  seq: m.seq,
  value1: m.value1,
  value2: m.value2,
  createId: m.create_id,
  createDate: m.create_date,
  updateId: m.update_id,
  updateDate: m.update_date,
});

const MapDtlRow = (d) => ({
  woptDtlIdx: d.wopt_dtl_idx,
  woptMstIdx: d.wopt_mst_idx,
  optionName: d.option_name,
  vehicleType: d.vehicle_type,
  seq: d.seq,
  value1: d.value1,
  value2: d.value2,
  createId: d.create_id,
  createDate: d.create_date,
  updateId: d.update_id,
  updateDate: d.update_date,
});

const MapMstWithDetails = (m) => ({
  ...MapMstRow(m),
  details: (m.washOptionDetails || []).map(MapDtlRow),
});

module.exports = {
  MapMstRow,
  MapDtlRow,
  MapMstWithDetails,
};
