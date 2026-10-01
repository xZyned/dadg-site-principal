import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/v1/certificates/bulk/route";
import { DELETE } from "../app/api/v1/certificates/[search]/delete/route";
import { TOPIC_OPTIONS, TOPICS } from "../lib/ouvidoria-topics";
test("escritas públicas são negadas sem tocar banco", async () => {
  assert.equal((await POST()).status, 410);
  assert.equal((await DELETE()).status, 410);
});
test("todos os tópicos apresentados são aceitos no contrato compartilhado", () => {
  for (const topic of TOPIC_OPTIONS)
    assert.equal(TOPICS.has(topic.value), true);
  assert.equal(TOPICS.has("problemas com a coordenação"), true);
});
