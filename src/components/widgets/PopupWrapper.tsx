function PopupWrapper({ children }: any) {
  return (
    <section className="fixed flex items-center justify-center top-0 left-0 bg-purple-400/40 w-full h-full z-[9999]">
      {children}
    </section>
  );
}

export default PopupWrapper;
