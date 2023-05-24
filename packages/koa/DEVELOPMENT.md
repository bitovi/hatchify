# Scaffold Development Recommentations

### Getting Started

1. Clone this repository: https://github.com/bitovi/bitscaffold
2. `cd bitscaffold`
3. `npm install`
4. `npm run build`
   - Runs Prettier
   - Runs TypeScript Compile
5. `npm run test`
   - The included test cases do a decent job at showing examples and usage of the different features of Scaffold
   - One of the test cases is a more end to end example of creating the Staffing App. This test case can also be run more directly as a standalone application, this is configured in the `.vscode/launch.json` file. Using the built in 'Run & Debug' menu should show the option to launch it.
6. `npm run docs`
   - Uses TypeDoc to generate the documentation pages, this also happens on a push to `main` and the generated documentation can be found here: https://bitovi.github.io/bitscaffold/
   - This is configured via the `.github/typedoc.yml` file
