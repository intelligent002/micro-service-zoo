{{- define "zoo-common.probesSwitch" -}}
{{- with .Values.livenessProbe }}
livenessProbe:
  {{- if eq .type "http" }}
  {{- include "zoo-common.httpProbe" . | nindent 2 }}
  {{- else if eq .type "tcp" }}
  {{- include "zoo-common.tcpProbe" . | nindent 2 }}
  {{- else if eq .type "exec" }}
  {{- include "zoo-common.execProbe" . | nindent 2 }}
  {{- end }}
{{- end }}

{{- with .Values.readinessProbe }}
readinessProbe:
  {{- if eq .type "http" }}
  {{- include "zoo-common.httpProbe" . | nindent 2 }}
  {{- else if eq .type "tcp" }}
  {{- include "zoo-common.tcpProbe" . | nindent 2 }}
  {{- else if eq .type "exec" }}
  {{- include "zoo-common.execProbe" . | nindent 2 }}
  {{- end }}
{{- end }}

{{- with .Values.startupProbe }}
startupProbe:
  {{- if eq .type "http" }}
  {{- include "zoo-common.httpProbe" . | nindent 2 }}
  {{- else if eq .type "tcp" }}
  {{- include "zoo-common.tcpProbe" . | nindent 2 }}
  {{- else if eq .type "exec" }}
  {{- include "zoo-common.execProbe" . | nindent 2 }}
  {{- end }}
{{- end }}
{{- end }}
