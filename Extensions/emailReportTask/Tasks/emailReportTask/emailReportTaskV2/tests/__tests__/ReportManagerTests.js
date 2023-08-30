"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const ReportFactory_1 = require("../../model/ReportFactory");
const ReportProvider_1 = require("../../providers/ReportProvider");
const ReportManager_1 = require("../../ReportManager");
const MissingDataError_1 = require("../../exceptions/MissingDataError");
describe("ReportManager Tests", () => {
    let reportProvider = sinon_1.default.createStubInstance(ReportProvider_1.ReportProvider);
    beforeEach(() => {
        const report = ReportFactory_1.ReportFactory.createNewReport(null);
        sinon_1.default.stub(reportProvider, "createReportAsync").returns(Promise.resolve(report));
        sinon_1.default.stub(report, "$dataMissing").returns(true);
    });
    test("ReportManager throws error when datamissing from report", () => __awaiter(void 0, void 0, void 0, function* () {
        let reportManager = new ReportManager_1.ReportManager(reportProvider, null, null);
        expect(reportManager.sendReportAsync(null)).rejects.toThrow(MissingDataError_1.MissingDataError);
    }));
});
//# sourceMappingURL=ReportManagerTests.js.map