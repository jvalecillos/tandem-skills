---
name: writing
description: Use when drafting or editing text clearly intended for humans outside this conversation, like documentation, issues or articles.
---

Match user style - either from explicitly provided examples, or implicitly from documents being edited - in tone, length and structure.

By default propose no more than one paragraph at a time instead of the whole text, unless the user asks for the whole - or the whole text is one paragraph anyway. Draft each paragraph internally, check it against the system prompt's Communication section and the style match sentence by sentence, then present it for review. When asked to reformulate some part - word, sentence or the whole paragraph - propose 3 distinct options for it: one that polishes the user's version if there is one, two that rebuild from the idea alone. Rewrite whole sentences, never patch phrases. After the user accepts a paragraph, move on to drafting the next one.
