# GA4 events

Events are sent through `src/lib/analytics.ts`.

| Event | Trigger | Parameters |
|---|---|---|
| `page_view` | Calculator opens | none |
| `calculator_used` | Calculator has a positive amount | none |
| `mode_changed` | Net/gross mode changes | `mode` |
| `currency_changed` | Currency changes | `currency` |
| `language_changed` | Language changes | `language` (`EN`, `PL`, `UA`) |
| `recruiter_message_copy` | Recruiter message is copied | none |
| `quick_scenario_click` | Quick scenario is selected | `scenario` (preset label) |
| `feedback_click` | Feedback link is clicked | none |
| `tax_profile_open` | Tax profile opens | none |
| `b2b_rate_changed` | B2B ryczałt rate changes | `rate` (percent × 100, rounded) |
| `b2b_zus_changed` | B2B ZUS profile changes | `zus` |
| `uop_kup_changed` | UoP KUP changes | `kup_type` |
| `uop_ppk_changed` | UoP PPK setting changes | `enabled` |
| `tax_profile_reset` | Tax profile is reset | none |

Privacy rules:

- Entered salary amounts are not sent.
- Calculated salary values are not sent.
- Quick-scenario events contain only the fixed preset label, such as `$5k net`.
- Vacancy text and URLs are not sent by this analytics module.
