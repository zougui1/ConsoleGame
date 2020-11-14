import { Layout } from '../../classes';
import { handleYesNo } from '../../utils';
import { Overlay } from '../../printers';

export const gameExitConfirmation = (): Promise<boolean> => new Promise((resolve, reject) => {
  const cleaner = () => {
    Layout.get().removeOverlay().erase();
  }

  const resolver = exit => {
    cleaner();

    if (exit) {
      process.exit(0);
    }

    resolve(exit);
  }

  const rejecter = err => {
    cleaner();
    reject(err);
  }

  Layout
    .get()
    .removeContent()
    .setOverlay(async () => {
      const overlayOptions = {
        title: 'Do you really want to leave the game?',
        maxHeight: 7,
        maxWidth: 43,
      };
      const overlayHandler = await new Overlay('[y/n]', overlayOptions).init();

      const yesNoHandler = handleYesNo();
      yesNoHandler.pressedYes
        .then(answer => {
          overlayHandler.abort();
          resolver(answer);
        })
        .catch(rejecter);

      overlayHandler.setAbortion(yesNoHandler.abort);

      return overlayHandler;
    })
    .render()
    .then(() => resolver(false))
    .catch(rejecter);
});
