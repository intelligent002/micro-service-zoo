{{- define "zoo-mysql.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "zoo-mysql.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "zoo-mysql.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "zoo-mysql.chart" -}}
{{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{- define "zoo-mysql.labels" -}}
app.kubernetes.io/name: {{ include "zoo-mysql.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: Helm
helm.sh/chart: {{ include "zoo-mysql.chart" . }}
{{- end }}

{{- define "zoo-mysql.selectorLabels" -}}
app.kubernetes.io/name: {{ include "zoo-mysql.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
