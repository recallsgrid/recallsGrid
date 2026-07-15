export const manifest = {
  screens: {
    scr_fk26vl: { name: "Landing Page", route: "/", position: { "x": 160, "y": 220 } },
    scr_50gma5: { name: "Dashboard", route: "/dashboard", position: { "x": 1560, "y": 220 } }
  },
  sections: {
    sec_ekpw40: { name: "Auth & Dashboard", x: 0, y: 0, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_ekpw40", children: [
    { kind: "screen", id: "scr_fk26vl" },
    { kind: "screen", id: "scr_50gma5" }]
  }]

};