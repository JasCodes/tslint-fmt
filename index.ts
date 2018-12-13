import { processFiles, processString } from "typescript-formatter"
import { Linter, Configuration } from "tslint"
import * as fs from "fs-extra"
import * as path from "path"

const tslint_fmt = async ( fileName: string, verbose: boolean = false, configFileName: string = "tslint.json" ) =>
{
    const fileContent = await fs.readFile( fileName, "utf8" )
    const configuration = Configuration.findConfiguration( configFileName, fileName ).results
    const tsLinter = new Linter( { fix: true } )
    tsLinter.lint( fileName, fileContent, configuration )
    verbose && console.info( tsLinter.getResult() )
    const tsFmt = await processFiles(
        [fileName],
        {
            verify: false,
            replace: true,
            verbose,
            tsfmt: true,
            editorconfig: true,
            tsconfig: true,
            vscode: true,
            tslint: true,
            tsconfigFile: "tsconfig.json",
            tsfmtFile: "tsfmt.json",
            tslintFile: "tslint.json",
            vscodeFile: ".vscode/settings.json"
        } )
    verbose && console.log( tsFmt[fileName] )
}

const main = async () =>
{
    const args = process.argv.slice( 2 )
    if ( args.length === 0 )
    {
        console.warn( "Requires file argument to lint" )
        return
    }

    const filename = args[0]

    const ext = path.extname( filename )
    const isDir = ( await fs.lstat( filename ) ).isDirectory()

    if ( ( ext !== ".ts" && ext !== ".tsx" ) || isDir )
    {
        console.warn( "Must be .ts or .tsx file" )
        return
    }
    await tslint_fmt( filename )
}

main()
