// The Live tab lands directly on the Live TV screen (the category pills + On
// Now + rows), so it is one tap away instead of three.
//
// It renders the SAME screen as the livetv/programs route rather than issuing a
// <Redirect>. This app uses native bottom tabs, which mount a real view for
// every tab at launch; a redirect-only index renders null and crashed the tab
// bar immediately on open. Every other tab's index is a real screen too.
export { default } from "../(home,libraries,search,favorites,watchlists,live)/livetv/programs";
