// Flat figure manifest. hasLight=false => dark-only (no hover flip).
// lit => light-variant suffix when not a bare ".png" (freight uses "_light").
// wide => double-wide tile (the big world / banner images).
const FIGURES = [
  { base: "00_population_5km", hasLight: true, title: "Most Europeans live in a few megaregions" },
  { base: "01_age_balance_5km", hasLight: true, title: "Europe's young and old live in different places" },
  { base: "02_foreign_born_5km", hasLight: true, title: "Europe's migrants live in its cities" },
  { base: "03_foreign_born_arrival_bivariate", hasLight: true, title: "New migration follows old, except in the east" },
  { base: "04_density_glyph_field", hasLight: true, title: "The anatomy of urban density" },
  { base: "05_density_lever_simplex", hasLight: true, title: "Which lever makes a city dense" },
  { base: "06_city_growth", hasLight: true, title: "How cities grew, then and now" },
  { base: "07_power_plants_europe", hasLight: true, title: "Europe runs on eight kinds of power" },
  { base: "08_heat_geothermal_bivariate", hasLight: true, title: "Europe's centre has warm rocks and cold winters" },
  { base: "09_crm_energy_transition", hasLight: true, title: "The transition has a materials bottleneck" },
  { base: "10_power_grid_foundation", hasLight: true, title: "The grid as it stands" },
  { base: "11_data_centres_over_grid", hasLight: true, title: "Data centres land on the grid that already exists" },
  { base: "12_new_capacity_over_grid", hasLight: true, title: "Three cancellations, three layers of the same stack" },
  { base: "13_new_capacity_breakdown", hasLight: true, title: "The new-build pipeline is essentially one thing" },
  { base: "14_large_loads_over_grid", hasLight: true, title: "The largest new loads cluster on a few nodes" },
  { base: "15_zoom_iberia", hasLight: true, title: "Zoom — Iberia" },
  { base: "16_zoom_baltic_poland", hasLight: true, title: "Zoom — Baltic and Poland" },
  { base: "17_electricity_mix_streamgraph", hasLight: true, title: "How the electricity mix moved" },
  { base: "18_gas_network_foundation", hasLight: true, title: "The gas network as it stands" },
  { base: "19_spiky_world_patents", hasLight: true, wide: true, title: "The world is spiky" },
  { base: "20_patents_per_city", hasLight: true, title: "Invention concentrates by city" },
  { base: "21_patents_concentration", hasLight: true, title: "How concentrated invention is" },
  { base: "22_patents_scaling", hasLight: true, title: "Invention scales superlinearly with size" },
  { base: "24_banner_patents", hasLight: false, wide: true, title: "Patent density, full width" },
  { base: "25_submarine_cables_world", hasLight: true, wide: true, title: "694 submarine cables carry the internet" },
  { base: "26_shipping_density_world", hasLight: true, wide: true, title: "Shipping and fibre share the same chokepoints" },
  { base: "27_tent_multimodal_hubs", hasLight: false, title: "Where the transport modes fuse" },
  { base: "28_tent_air_network", hasLight: false, title: "The European air layer" },
  { base: "29_tent_layercake", hasLight: false, title: "The multimodal network as a layer cake" },
  { base: "30_freight_accessibility", hasLight: true, lit: "_light", title: "Freight reach as a killed random walk" },
  { base: "31_backyards_index_map", hasLight: true, title: "Empty corridors survive only on Europe's rim" },
  { base: "32_backyards_concentration_scatter", hasLight: true, title: "More spread, more backyards" },
  { base: "33_business_concentration", hasLight: true, title: "Primate cities host most European businesses" },
  { base: "34_city_region_industry_hhi", hasLight: true, title: "How many industries a region really runs on" },
  { base: "35_lau_depopulation", hasLight: true, title: "Most of Europe lost people since 1961 — except its cities" },
  { base: "36_universities_per_city", hasLight: true, title: "Universities follow capitals, students don't" },
  { base: "37_cordis_network", hasLight: true, title: "Research links concentrate on a few hubs" },
  { base: "38_cordis_residual_map", hasLight: true, title: "Where collaboration outruns the air network" },
  { base: "39_cordis_residual_scatter", hasLight: true, title: "Collaboration lags flights — elites excepted" },
  { base: "40_asml_supply_radial", hasLight: true, title: "Hundreds of suppliers — a dozen irreplaceable" },
  { base: "41_asml_supply_map_europe", hasLight: true, title: "Lithography is Dutch — except its optics, German" },
];

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const px = (v) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(v));

// Size a tile by its image aspect ratio and the (un-collapsed) column width.
// Never measure the tile's own height — as a grid item it's clamped to the
// row span we set, which would feed back on itself.
function sizeTile(tile) {
  const grid = document.getElementById("grid");
  const gap = parseFloat(getComputedStyle(grid).rowGap) || 16;
  const unit = px("--rowunit") || 4;
  const ratio = parseFloat(tile.dataset.ratio) || 1.2; // height / width
  const w = tile.clientWidth;
  if (!w) return;
  let h = w * ratio;
  if (tile.classList.contains("open")) {
    h = Math.min(h, window.innerHeight * 0.84);
  }
  const span = Math.max(1, Math.ceil((h + gap) / (unit + gap)));
  tile.style.gridRowEnd = `span ${span}`;
}

function sizeAll() {
  document.querySelectorAll(".tile").forEach(sizeTile);
}

function build() {
  const grid = document.getElementById("grid");

  shuffled(FIGURES).forEach((f) => {
    const tile = document.createElement("figure");
    tile.className = "tile" + (f.wide ? " wide" : "");
    tile.dataset.ratio = f.wide ? "0.62" : "1.2"; // provisional until load

    const dark = document.createElement("img");
    dark.className = "layer dark";
    dark.decoding = "async";
    dark.alt = f.title;
    dark.src = `images/${f.base}_dark.png`;
    tile.appendChild(dark);

    if (f.hasLight) {
      const light = document.createElement("img");
      light.className = "layer light";
      light.loading = "lazy";
      light.alt = "";
      light.src = `images/${f.base}${f.lit || ""}.png`;
      tile.appendChild(light);
    }

    tile.addEventListener("click", () => toggleOpen(tile));
    grid.appendChild(tile);
    sizeTile(tile); // provisional, so tiles aren't 4px lines before load

    const apply = () => {
      if (dark.naturalWidth) {
        tile.dataset.ratio = (dark.naturalHeight / dark.naturalWidth).toString();
      }
      sizeTile(tile);
    };
    if (dark.complete && dark.naturalWidth) apply();
    else dark.addEventListener("load", apply);
  });

  let raf;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(sizeAll);
  });
}

function toggleOpen(tile) {
  const grid = document.getElementById("grid");
  const wasOpen = tile.classList.contains("open");
  grid.querySelectorAll(".tile.open").forEach((t) => t.classList.remove("open"));
  if (wasOpen) {
    grid.classList.remove("has-open");
    requestAnimationFrame(sizeAll);
    return;
  }
  tile.classList.add("open");
  grid.classList.add("has-open");
  requestAnimationFrame(() => {
    sizeAll();
    tile.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const grid = document.getElementById("grid");
  grid.querySelectorAll(".tile.open").forEach((t) => t.classList.remove("open"));
  grid.classList.remove("has-open");
  requestAnimationFrame(sizeAll);
});

document.addEventListener("DOMContentLoaded", build);
