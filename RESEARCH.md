# Research Notes

## Problem Domain
Low-Level Design (LLD) is a critical skill in software engineering interviews and real-world system design. Unlike High-Level Design (HLD), LLD focuses on class-level structure: identifying classes, interfaces, relationships, and applying OOP/SOLID principles.

## Existing Tools Reviewed
- **LeetCode/HackerRank** — Focus on algorithms, not design
- **System Design Primer (GitHub)** — Great reading, no practice/feedback loop
- **Educative.io Grokking OOD** — Paid, text-based, no interactive practice
- **UML editors** — Too heavy for quick practice; high barrier to entry

## Gap Identified
No free tool offers:
1. Structured LLD practice (not just reading)
2. Immediate evaluation feedback
3. Iterative improvement through retry
4. No UML drawing required — structured forms instead

## Design Decisions Made Based on Research

### Structured Input over Free-form UML
Users think in terms of "I have a class called X with methods Y" — not in terms of drawing boxes. Structured forms lower the barrier to entry and make evaluation easier.

### Deterministic + AI Evaluation
- Deterministic rules cover objective metrics (class count, SRP violations, missing interfaces)
- AI provides subjective feedback (design quality, naming, design pattern suggestions)
- AI is **optional** — the platform works fully without it

### Scoring Criteria Weights
Based on common LLD interview rubrics:
| Criterion | Weight | Rationale |
|-----------|--------|-----------|
| Requirement Coverage | 25% | Must address the stated requirements |
| Responsibility Separation | 25% | SRP is the most commonly tested principle |
| Abstraction | 20% | Interface usage, polymorphism |
| Relationships | 15% | Composition, inheritance, association |
| Extensibility | 15% | OCP — can new features be added without modifying existing code? |

### Three Seed Problems
Selected to cover different difficulty levels and design patterns:
1. **Parking Lot** (Medium) — Strategy, Composition, Encapsulation
2. **Vending Machine** (Easy) — State pattern, Encapsulation
3. **Elevator System** (Medium) — State, Strategy, concurrent scheduling

These are the three most commonly asked LLD problems in interviews.
