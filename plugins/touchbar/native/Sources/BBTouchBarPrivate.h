// Private Touch Bar / DFR surface used for a persistent Control Strip item and
// an expanded system-modal bar. Derived from Herdr Touch Bar (MIT), which in
// turn documents the same entry points used by MTMR and Pock.

#import <Cocoa/Cocoa.h>

@interface NSTouchBarItem (BBTouchBarPrivate)
+ (void)addSystemTrayItem:(NSTouchBarItem *)item;
+ (void)removeSystemTrayItem:(NSTouchBarItem *)item;
@end

@interface NSTouchBar (BBTouchBarPrivate)
+ (void)presentSystemModalTouchBar:(NSTouchBar *)touchBar
                         placement:(long long)placement
          systemTrayItemIdentifier:(NSTouchBarItemIdentifier)identifier;
+ (void)dismissSystemModalTouchBar:(NSTouchBar *)touchBar;
+ (void)minimizeSystemModalTouchBar:(NSTouchBar *)touchBar;
@end

extern void DFRElementSetControlStripPresenceForIdentifier(
    NSTouchBarItemIdentifier identifier,
    BOOL present
);
extern void DFRSystemModalShowsCloseBoxWhenFrontMost(BOOL shows);
