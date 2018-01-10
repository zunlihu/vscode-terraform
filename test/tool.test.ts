// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as tool from '../src/tool';

// Defines a Mocha test suite to group tests of similar kind together
suite("Tool Tests", () => {

    // Defines a Mocha unit test
    test("Returns null for unknown tool", () => {
        assert.equal(null, tool.pickToolDownloadUrl("tool-which-does-not-exist", "win32", "x64", "latest"));
    });

    test("Returns the url of the latest version when requested", () => {
        let url = 'https://releases.hashicorp.com/terraform/0.10.8/terraform_0.10.8_windows_amd64.zip';
        assert.equal(url, tool.pickToolDownloadUrl("terraform", "win32", "x64", "latest"));
    });

    test("Returns the url of the requested version when requested", () => {
        let url = 'https://releases.hashicorp.com/terraform/0.10.7/terraform_0.10.7_windows_amd64.zip';
        assert.equal(url, tool.pickToolDownloadUrl("terraform", "win32", "x64", "0.10.7"));
    });

    test("Returns null when the os or arch is unknown", () => {
        assert.equal(null, tool.pickToolDownloadUrl("terraform", "plan9", "x64", "0.10.7"));
        assert.equal(null, tool.pickToolDownloadUrl("terraform", "win32", "arm", "0.10.7"));
    });
});