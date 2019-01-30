import { InjectionToken } from '@angular/core';

const defaultScript = `
///$tab Sense Excel Reporting
SET task = ´
tasks:
[
  {
    reports:
    [
    ]
  }
]
´

//Start reporting
Let resultWithTaskId = SER.START(task);
TRACE TaskId: $(resultWithTaskId);

//Show Versions
Let versions = SER.STATUS('versions: all');
TRACE Versions: $(versions);

//Wait for finish
Let Status = 0;
Do while Status < 3 and Status > -1
  Let Result = SER.STATUS(resultWithTaskId);
  Let LogMsg = TextBetween(Result,'log":"','"}');
  Let Status = num#(TextBetween(Lower(Result),'status":','}'))+0;
  TRACE Status: $(Status) $(LogMsg);
  Sleep 2000;
Loop

TRACE $(Result);`;

export const SER_INITIAL_SCRIPT = new InjectionToken('SerDefaultScript', {
  factory: () => defaultScript
});
