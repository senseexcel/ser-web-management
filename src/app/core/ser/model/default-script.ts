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
´;

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
  Let LogMsg = TextBetween(Result,'log":"','"');
  Let Status = num(mid(Result,11,1));
  TRACE Status: $(Status) - $(LogMsg);
  Sleep 2000;
Loop

Let LogDist = Replace(
                 PurgeChar(
                     Replace(
                        Replace(
                            Replace(
                                Replace(
                                    Replace(
                                        Replace(
                                            Replace(mid(Text(Result),index(Text(Result),'hubResults'))
                                            ,'\r\n',chr(13)&chr(10))
                                            ,'\"','')
                                            ,'[','')
                                            ,']','')
                                            ,'{','')
                                            ,'}','')
                                            ,'\\\\', '\')
                                            ,',')
                                            ,'      ', '');

TRACE Results: $(LogDist);
`;

export const SER_INITIAL_SCRIPT = new InjectionToken('SerDefaultScript', {
  factory: () => defaultScript
});
