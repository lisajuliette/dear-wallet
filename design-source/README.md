# Design source

`canvas/` holds the source of every artboard on the Dear Wallet design canvas. They are a pixel spec, not code to port.

- `canvas.json` lists the boards, their order and which file each artboard uses.
- Each `.dc.html` file is one component or screen. Inline styles are exact values in pt at 390 × 844.
- `{{t.c3}}` style holes are token names. Map them to NativeWind classes (`bg-c3`, `text-ink`, `border-outline`).
- `<sc-if>` blocks are states, `<sc-for>` blocks are lists, `<dc-import name="...">` pulls in a shared component.
- The script's `renderVals()` holds the state data, the copy and the compact values used when the window is under 740 pt tall.
- `data-props` on the root lists each file's states and props.
- Screen files without a suffix are the components (`Home.dc.html`); state wrappers sit beside them.
- `PaletteMatrix.dc.html` shows Home, Tally, Diary entry and Settings in all six palettes; `SmallPhone.dc.html` shows every screen at 375 × 667.
