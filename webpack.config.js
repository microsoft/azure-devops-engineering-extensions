const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        temp: './temp.js',
    },
    output: {
        path: __dirname + '/dist'
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "./images", to: "images", context: "." },
                { from: "./Extensions/emailReportTask/images", to: "images", context: "." },
                { from: "./README.md", to: "README.md" },
                { from: "./LICENSE", to: "." },
                { from: "./Extensions/emailReportTask/azure-devops-extension.json", to: "azure-devops-extension.json" },
                {
                    from: "./Extensions/emailReportTask/Tasks",
                    globOptions: {
                        dot: true,
                        gitignore: false,
                        ignore: ["**/Tests/**", "**/*.ts"],
                    },
                    to: "Tasks"
                },

            ]
        })
    ]
};