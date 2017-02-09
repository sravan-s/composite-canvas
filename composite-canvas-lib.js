function CompositeCanvas(source) {
  let state = {
    source: source
  };
  let events = {
    action: 'FILTER', // FILTER,
    reducer: (row, index) => {
      // do whatever
    }
    // : 'ASC'
  };
  return {
    getState: () => state,
    _getEvents: () => events,
    dispatchEvent: () => {}
  };
}
