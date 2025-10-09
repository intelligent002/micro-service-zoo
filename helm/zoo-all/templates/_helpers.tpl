{{/*
Common naming and labeling helpers for the zoo-all umbrella chart
*/}}

{{- define "zoo-all.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "zoo-all.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "zoo-all.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "zoo-all.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}

{{- define "zoo-all.labels" -}}
app.kubernetes.io/name: {{ include "zoo-all.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ include "zoo-all.chart" . }}
{{- end -}}
