if (window.top === window) {
  import("./scripts/window").then(({ main }) => {
    main()
  })
} else {
  import("./scripts/iframe").then(({ main }) => {
    main()
  })
}