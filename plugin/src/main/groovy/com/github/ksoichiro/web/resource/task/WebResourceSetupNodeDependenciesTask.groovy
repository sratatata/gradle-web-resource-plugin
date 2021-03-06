package com.github.ksoichiro.web.resource.task

import com.github.ksoichiro.web.resource.extension.WebResourceExtension
import org.gradle.api.DefaultTask
import org.gradle.api.file.FileTree
import org.gradle.api.tasks.TaskAction

class WebResourceSetupNodeDependenciesTask extends DefaultTask {
    static final String NAME = 'webResourceSetupNodeDependencies'
    static final String PRE_INSTALLED_NODE_MODULES_DIR = "node_modules"
    WebResourceExtension extension

    WebResourceSetupNodeDependenciesTask() {
        this.project.afterEvaluate {
            extension = project.webResource
            getInputs().property('version', WebResourceExtension.VERSION)
            getOutputs().files(new File(extension.workDir, 'node_modules'))
        }
    }

    @TaskAction
    void exec() {
        prepareWorkDir()
        installDependenciesFromJar()
    }

    void prepareWorkDir() {
        def workDir = extension.workDir
        if (!workDir.exists()) {
            workDir.mkdirs()
        }
    }

    void installDependenciesFromJar() {
        URL url = getClass().getResource("/${PRE_INSTALLED_NODE_MODULES_DIR}")
        String jarPath = url.toString().replaceAll("jar:file:", "").replaceAll("!.*\$", "")
        File installDir = extension.workDir
        FileTree tree = jarPath.contains("file:") ? project.fileTree(jarPath.split("file:")[1].replaceAll(PRE_INSTALLED_NODE_MODULES_DIR, ""))
            : project.zipTree(new File(jarPath))
        project.copy {
            from tree.matching { it.include("${PRE_INSTALLED_NODE_MODULES_DIR}/**") }
            into installDir
        }
    }
}
