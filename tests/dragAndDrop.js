module.exports = async function dragAndDrop(page, originSelector, destinationSelector) {
  const origin = await page.$(originSelector);
  const destination = await page.$(destinationSelector);
  const originBox = await origin.boundingBox();
  const destinationBox = await destination.boundingBox();
  const lastPositionCoordenate = (box) => ({
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  });
  const getPayload = (box) => ({
    bubbles: true,
    cancelable: true,
    screenX: lastPositionCoordenate(box).x,
    screenY: lastPositionCoordenate(box).y,
    clientX: lastPositionCoordenate(box).x,
    clientY: lastPositionCoordenate(box).y,
  });

  // Function in browser.
  const pageFunction = async (_originSelector, _destinationSelector, originPayload, destinationPayload) => {
    const _origin = document.querySelector(_originSelector);
    let _destination = document.querySelector(_destinationSelector);
    // If has child, put at the end.
    _destination = _destination.lastElementChild || _destination;

    // Init Events
    _origin.dispatchEvent(new MouseEvent('pointerdown', originPayload));
    _origin.dispatchEvent(new DragEvent('dragstart', originPayload));

    await new Promise((resolve) => setTimeout(resolve, 10));
    _destination.dispatchEvent(new MouseEvent('dragenter', destinationPayload));
    _origin.dispatchEvent(new DragEvent('dragend', destinationPayload));
  };

  // Init drag and drop.
  await page.evaluate(
    pageFunction,
    originSelector,
    destinationSelector,
    getPayload(originBox),
    getPayload(destinationBox),
  );
}